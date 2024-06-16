import { firefox } from 'playwright';
import { fork } from 'child_process';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = "https://fb.com";
const browserCount = 10;
const browserCloseTimeout = 120000; // 2 minutes

console.log(`Watching: ${url}`);

// Helper to create inline worker code
const workerCode = `
  import { parentPort } from 'worker_threads';
  import { firefox } from 'playwright';
  import UserAgent from 'user-agents';

  const url = "${url}";
  const browserCloseTimeout = ${browserCloseTimeout};

  async function openPage() {
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: new UserAgent().toString()
      });
      const page = await context.newPage();
      await page.goto(url, { timeout: 60000 });
      await page.click('button[aria-label="Play"]');
      await page.waitForTimeout(120000);
      parentPort.postMessage({ success: true });
    } catch (error) {
      console.error('Error:', error);
      parentPort.postMessage({ success: false, error: error.toString() });
    } finally {
      if (browser) {
        setTimeout(async () => {
          await browser.close();
        }, browserCloseTimeout);
      }
    }
  }

  openPage();
`;

async function openPage() {
  return new Promise((resolve, reject) => {
    const workerPath = join(__dirname, 'worker.js');

    // Create worker file dynamically
    
fs.writeFileSync(workerPath, workerCode);


    const child = fork(workerPath);

    child.on('message', (message) => {
      if (message.success) {
        resolve();
      } else {
        reject(message.error);
      }
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code}`));
      }
      // Cleanup worker file
      require('fs').unlinkSync(workerPath);
    });
  });
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < browserCount; i++) {
    promises.push(openPage());
  }
  await Promise.all(promises).catch(error => {
    console.error('Error running the code:', error);
  });
}

async function repeatForever() {
  while (true) {
    await executeInParallel();
    console.log(`Watching again: ${url}`);
  }
}

repeatForever();
