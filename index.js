const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');
const url = 'https://m.youtube.com/watch?v=u5j85Z7EMuM'
const numBrowsers = 5; // عدد المتصفحات
const closeDuration = 60; // مدة غلق المتصفحات بالثواني

const runBrowser = async () => {
  // إنشاء وكيل مستخدم عشوائي
  const userAgent = new UserAgent().toString();

  // أفتح المتصفح
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // تعيين وكيل المستخدم العشوائي
  await page.setUserAgent(userAgent);

  // اذهب الى رابط الفيديو على اليوتيوب
  await page.goto(url);
  console.log(`go with user-agent: ${userAgent}`);
  
  // انتظر تحميل الصفحة بالكامل
  await page.waitForSelector('button[aria-label="Play"]');

  // اضغط على زر التشغيل
  await page.click('button[aria-label="Play"]');
  console.log('clicked');
  
  // انتظر مدة محددة
  await new Promise(resolve => setTimeout(resolve, closeDuration * 1000));

  // اغلق المتصفح
  await browser.close();

  // إعادة تشغيل المتصفح
  runBrowser();
};

// إنشاء مصفوفة تحتوي على الوعود لتشغيل المتصفحات
const startBrowsers = async (num) => {
  const promises = Array(num).fill().map(() => runBrowser());
  await Promise.all(promises);
};

startBrowsers(numBrowsers)
  .then(() => console.log('All initial browsers have started.'))
  .catch(error => console.error('An error occurred:', error));
