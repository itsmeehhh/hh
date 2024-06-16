import { firefox } from 'playwright';
import UserAgent from 'user-agents';

const url = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
console.log(`watching: ${url}`);

const browsersCount = 5;
const browserInstances = [];

for (let i = 0; i < browsersCount; i++) {
  browserInstances.push((async () => {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ userAgent: userAgent.toString() });
    console.log(`Browser ${i+1} userAgent: ${userAgent.toString()}`);
    const page = await context.newPage();
    await page.goto(url, { timeout: 0 });
    console.log(`Browser ${i+1} gone`);
    try {
      await page.click('button[aria-label="Play"]');
      console.log(`Browser ${i+1} clicked`);
    } catch (e) {
      console.log(`Browser ${i+1} not clicked`);
    }
    
    // Wait for 1 minute
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    await browser.close();
  })());
}

Promise.all(browserInstances).then(() => {
  console.log('All browsers have finished their tasks');
});
