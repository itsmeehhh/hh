import { firefox } from 'playwright';
import UserAgent from 'user-agents';


let url = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
console.log(`watching: ${url}`);
let timewatch = 20000;
const userAgent = new UserAgent();
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url, { timeout: 0 });
      console.log('gonne');
     try {
      await page.click('button[aria-label="Play"]');
      console.log('clicked');
     } catch (e) {
       console.log('no clicked');
     }
      await page.waitForTimeout(timewatch);
      resolve();
    } catch (error) {
      console.error('error b:', error);
      reject(error);
    } finally {
      if (browser) {
        await browser.close();
        process.exit(1)
      }
    }
  
