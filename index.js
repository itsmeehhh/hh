import { firefox } from 'playwright';
import UserAgent from 'user-agents';

let url = "https://fb.com";
console.log(`watching: ${url}`);

async function openPage(userAgentString) {
  let browser;
  try {
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: userAgentString
    });
    const page = await context.newPage();
    await page.goto(url, { timeout: 60000 }).catch(e => console.error('Error during page.goto:', e));
    await page.click('button[aria-label="Play"]').catch(e => console.error('Error during page.click:', e));
    console.log('clicked');
    await page.waitForTimeout(120000);
  } catch (error) {
    console.error('error:', error);
  } finally {
    if (browser) {
      await browser.close().catch(e => console.error('Error during browser.close:', e));
    }
  }
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 5; i++) {
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
