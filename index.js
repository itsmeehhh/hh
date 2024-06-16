import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// التعريفات الأساسية
const URL = 'https://www.example.com';
const BROWSER_COUNT = 5; // عدد المتصفحات التي نريد تشغيلها
const BROWSER_TIMEOUT = 30000; // وقت الإغلاق بالمللي ثانية (30 ثانية)

// دالة لفتح متصفح فايرفوكس مع user-agent فريد
const openBrowser = async (index) => {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });

  const browser = await firefox.launch({ headless: true });

  const context = await browser.newContext({
    userAgent: userAgent.toString(),
  });

  const page = await context.newPage();

  await page.goto(URL);

  const ua = await page.evaluate(() => navigator.userAgent);
  console.log(`Browser ${index + 1} User-Agent used: ${ua}`);

  // محاولة الضغط على زر "Play"
  const playButton = await page.$('button[aria-label="Play"]'); // يمكنك تعديل الـselector حسب الحاجة
  if (playButton) {
    await playButton.click();
    console.log(`Browser ${index + 1}: Play button clicked`);
  } else {
    console.log(`Browser ${index + 1}: Play button not found`);
  }

  // اغلاق المتصفح بعد وقت محدد
  setTimeout(async () => {
    await browser.close();
    console.log(`Browser ${index + 1} closed and will reopen`);
  }, BROWSER_TIMEOUT);
};

// دالة رئيسية لتشغيل المتصفحات
const main = async () => {
  while (true) { // حلقة لا نهائية لإعادة فتح المتصفحات عند الإغلاق
    console.log('Watch again');
    const browserPromises = Array.from({ length: BROWSER_COUNT }).map((_, index) => openBrowser(index));

    await Promise.all(browserPromises);

    console.log('All browsers opened, waiting for the timeout to close them...');
    // انتظار قبل إعادة الفتح
    await new Promise(resolve => setTimeout(resolve, BROWSER_TIMEOUT + 1000)); // ننتظر قليلا بعد اغلاق المتصفحات
  }
};

main();
