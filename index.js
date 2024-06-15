import { firefox } from 'playwright';
import UserAgent from 'user-agents';
let url = "https://youtube.com/shorts/sI9VgfUvoI8?si=sLntyiaXnaO1Ol95";
console.log(`watching: ${url}`);

async function openPage() {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url, { timeout: 60000 });
      const button = 'button[aria-label="Play"]'
      if (button) {
        console.log('clicked');
      await page.click('button[aria-label="Play"]');
      } else {
        console.log('no clicked');
      }
      await page.waitForTimeout(120000);
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
