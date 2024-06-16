import fs from 'fs';
import child_process from 'child_process';
import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import bodyParser from 'body-parser';
import path from 'path';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import { dirname } from 'path';
import UserAgent from 'user-agents';

// تحويل URL الملف الحالي إلى مسار ملف
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folderName = 'database';
const children = {};
const logs = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('requestLogs', (filename) => {
    socket.emit('logs', logs[filename]);
  });
});
//وظائف تشغيل الملفات 
function runFile(file) {
  const filePath = `./${folderName}/${file}`;
  const child = child_process.spawn('node', [filePath]);
  logs[file] = [];
  child.stdout.on('data', (data) => {
    const message = data.toString();
    if (!logs[file]) {
      logs[file] = [];
    }
    logs[file].push(message);
  });
  child.stderr.on('data', (data) => {
    const message = data.toString();
    if (!logs[file]) {
      logs[file] = [];
    }
    console.error(`${file} : Code error, see logs for more`);
    logs[file].push(message);
    if (message.includes('Cannot find module')) {
      const moduleName = message.match(/'([^']+)'/)[1];
      stopFile(file);
      installModule(moduleName, () => {
        runFile(file);
      });
    }
  });
  child.on('close', (code) => {
    console.log(`${file}: exited with code ${code}`);
    io.emit('newLog', { file, message: `Process exited with code ${code}` });
  });
  children[file] = child;
}

function stopFile(file) {
  const child = children[file];
  if (child) {
    child.kill('SIGINT');
  }
  delete children[file];
  delete logs[file];
}

// وظيفة لحذف كل السجلات كل 5 دقائق
setInterval(() => {
  Object.keys(logs).forEach((file) => {
    delete logs[file];
  });
}, 300000);

function installModule(moduleName, callback) {
  exec(`npm install ${moduleName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing module ${moduleName}: ${stderr}`);
      return;
    }
    console.log(`Module ${moduleName} installed successfully: ${stdout}`);
    callback();
  });
}

fs.readdir(folderName, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach(runFile);
});

fs.watch(folderName, (eventType, filename) => {
  if (eventType === 'rename') {
    fs.access(`./${folderName}/${filename}`, (err) => {
      if (err) {
        console.log(`File ${filename} was deleted`);
        stopFile(filename);
      } else {
        console.log(`File ${filename} was added`);
        runFile(filename);
      }
    });
  }
});
