import { firefox } from 'playwright';
import UserAgent from 'user-agents';

let url = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
console.log(`watching: ${url}`);
const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    
const browser = await firefox.launch({ headless: true });
const context = await browser.newContext({ userAgent: userAgent.toString() });
console.log(userAgent.toString());
const page = await context.newPage();
await page.goto(url, { timeout: 0 });
console.log('gone');
try {
  await page.click('button[aria-label="Play"]');
  console.log('clicked');
} catch (e) {
  console.log('not clicked');
}

// Wait for 1 minute
await new Promise(resolve => setTimeout(resolve, 60000));

await browser.close();
