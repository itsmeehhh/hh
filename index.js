import { fork } from 'child_process';
import { firefox } from 'playwright';

async function openBrowserAndPlayVideo() {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://m.youtube.com/watch?v=u5j85Z7EMuM');
  console.log('1');
  // Click the play button if it exists
  const playButton = await page.$('button[aria-label="Play"]');
  if (playButton) {
    await playButton.click();
console.log('2');
  }
  
  // Close the browser after a minute
  setTimeout(async () => {
    await browser.close();
  }, 60000);
}

for (let i = 0; i < 5; i++) {
  fork(import.meta.url, ['child'], { execArgv: [] });
}

if (process.argv[2] === 'child') {
  openBrowserAndPlayVideo();
}
