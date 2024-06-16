import { firefox } from 'playwright';
import UserAgent from 'user-agents';


let url = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
console.log(`watching: ${url}`);
let timewatch = 20000;
const userAgent = new UserAgent();
    
      const browser = await firefox.launch({ headless: true });
      const context = await browser.newContext(userAgent);
      const page = await context.newPage();
      await page.goto(url, { timeout: 0 });
      console.log('gonne');
     try {
      await page.click('button[aria-label="Play"]');
      console.log('clicked');
     } catch (e) {
       console.log('no clicked');
     }
        setTimeout(
            browser.close,
            60000)
    
