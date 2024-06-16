import { firefox } from 'playwright';
import UserAgents from 'user-agents';

(async () => {
  const browser = await firefox.launch({ headless: true }); // تشغيل المتصفح في الوضع الخفي
  const userAgent = new UserAgents();
  
  const context = await browser.newContext({
    userAgent: userAgent.toString()
  });
  const page = await context.newPage();
  await page.goto('https://m.youtube.com/watch?v=u5j85Z7EMuM');
  
  // انتظر حتى يتم تحميل الصفحة بالكامل
  await page.waitForLoadState('load');
  
  // انقر على زر التشغيل
  await page.click('button[aria-label="Play"]');
  console.log('done');
  // انتظر دقيقة واحدة
  await page.waitForTimeout(60000);
  
  // أغلق المتصفح
  await browser.close();
})();
