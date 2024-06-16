const puppeteer = require('puppeteer');

(async () => {
  // أفتح المتصفح
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // اذهب الى رابط الفيديو على اليوتيوب
  await page.goto('https://m.youtube.com/watch?v=u5j85Z7EMuM');
  console.log('go');
  // انتظر تحميل الصفحة بالكامل
  await page.waitForSelector('button[aria-label="Play"]');

  // اضغط على زر التشغيل
  await page.click('button[aria-label="play"]');
  console.log('clicked');
  // انتظر دقيقة واحدة
  await new Promise(resolve => setTimeout(resolve, 60000));

  // اغلق المتصفح
  await browser.close();
})();
