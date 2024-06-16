import { fork } from 'child_process';
import { firefox } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function openBrowserAndPlayVideo() {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://m.youtube.com/watch?v=u5j85Z7EMuM');
  console.log('go');
  // Click the play button if it exists
  const playButton = await page.$('button[aria-label="Play"]');
  if (playButton) {
    await playButton.click();
    console.log('clicked');
  }
  
  // Close the browser after a minute
  setTimeout(async () => {
    await browser.close();
  }, 60000);
}

for (let i = 0; i < 5; i++) {
  fork(path.join(__dirname, 'index.js'), ['child'], { execArgv: [] });
}

if (process.argv[2] === 'child') {
  openBrowserAndPlayVideo();
}
