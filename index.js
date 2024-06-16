const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');
const url = 'https://m.youtube.com/watch?v=u5j85Z7EMuM'; // عنوان الفيديو

const numBrowsers = 5; // عدد المتصفحات
const closeDuration = 60; // مدة غلق المتصفحات بالثواني

// مجموعة لتخزين user agents المستخدمة
const usedUserAgents = new Set();

const getUniqueUserAgent = () => {
  let userAgent;
  do {
    // توليد User-Agent جديد والتأكد من أنه ليس لجهاز جوال
    userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
  } while (usedUserAgents.has(userAgent)); // التأكد من عدم التكرار
  usedUserAgents.add(userAgent);
  return userAgent;
};

const runBrowser = async () => {
  // إنشاء وكيل مستخدم فريد
  const userAgent = getUniqueUserAgent();

  // أفتح المتصفح
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // تعيين وكيل المستخدم العشوائي
  await page.setUserAgent(userAgent);

  // تعيين viewport لتكون متوافقة مع وكيل المستخدم
  await page.setViewport({ width: 1280, height: 800 });

  // ضبط platform لتكون متوافقة مع وكيل المستخدم
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'platform', {
      get: () => 'Win32', // يمكنك تغييره إلى 'MacIntel' إذا كنت تريد محاكاة نظام macOS
    });
  });

  // اذهب الى رابط الفيديو على اليوتيوب
  await page.goto(url);
  try {
  // انتظر تحميل الصفحة بالكامل
  await page.waitForSelector('button[aria-label="Play"]');

  // اضغط على زر التشغيل
  await page.click('button[aria-label="Play"]');
  console.log('clicked');
  } catch (e) {
    console.log('no clicked');
  }
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
process.on('uncaughtException', function (err) {
  console.log('watch again:', url);
  isRestart = true;
});

startBrowsers(numBrowsers)
  .then(() => console.log('All initial browsers have started.'))
  .catch(error => console.error('An error occurred:', error));
