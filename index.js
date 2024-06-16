import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// تعريفات
const URL = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
const BROWSERS_COUNT = 5;
const WATCH_DURATION_SECONDS = 60; // مدة الانتظار بالثانية

console.log(`watching: ${URL}`);

async function openBrowsers() {
  const browserInstances = [];

  for (let i = 0; i < BROWSERS_COUNT; i++) {
    browserInstances.push((async () => {
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      const browser = await firefox.launch({ headless: true });
      const context = await browser.newContext({ userAgent: userAgent.toString() });
      console.log(`Browser ${i+1} userAgent: ${userAgent.toString()}`);
      const page = await context.newPage();
      await page.goto(URL, { timeout: 0 });
      console.log(`Browser ${i+1} gone`);
      try {
        await page.click('button[aria-label="Play"]');
        console.log(`Browser ${i+1} clicked`);
      } catch (e) {
        console.log(`Browser ${i+1} not clicked`);
      }
      
      // Wait for the specified duration in milliseconds
      await new Promise(resolve => setTimeout(resolve, WATCH_DURATION_SECONDS * 1000));
      
      await browser.close();
    })());
  }

  await Promise.all(browserInstances);
  console.log('All browsers have finished their tasks');
  
  // إعادة فتح المتصفحات
  openBrowsers();
}

// بدء العملية
openBrowsers();
