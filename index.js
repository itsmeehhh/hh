import { firefox } from 'playwright';
import UserAgent from 'user-agents';
import ytdl from 'ytdl-core';

let url = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
const videoInfo = await ytdl.getBasicInfo(url);
const videoDuration = parseInt(videoInfo.videoDetails.lengthSeconds) + 10;
console.log(`watching: ${url}`);
let timewatch = videoDuration;

async function openPage() {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url, { timeout: 60000 });
      await page.click('button[aria-label="Play"]');
      await page.waitForTimeout(videoDuration);
      resolve();
    } catch (error) {
      console.error('error:', error);
      reject(error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    const userAgent = new UserAgent();
    promises.push(openPage(userAgent.toString()));
  }
  await Promise.all(promises).catch(error => {
    console.error('error run the codes :', error);
  });
}

async function repeatForever() {
  while (true) {
    await executeInParallel();
    console.log(`watching again : ${url}`);
  }
}

repeatForever();
