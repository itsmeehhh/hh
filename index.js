import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// التعريفات الأساسية
const URL = 'https://www.example.com';
const BROWSER_COUNT = 5; // عدد المتصفحات التي نريد تشغيلها
const BROWSER_TIMEOUT = 30000; // وقت الإغلاق بالمللي ثانية (30 ثانية)

const openBrowser = async () => {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });

  const browser = await firefox.launch({ headless: true });

  const context = await browser.newContext({
    userAgent: userAgent.toString(),
  });

  const page = await context.newPage();

  await page.goto(URL);

  const ua = await page.evaluate(() => navigator.userAgent);
  console.log(`User-Agent used: ${ua}`);

  // محاولة الضغط على زر "Play"
  const playButton = await page.$('button[aria-label="Play"]'); // يمكنك تعديل الـselector حسب الحاجة
  if (playButton) {
    await playButton.click();
    console.log('Play button clicked');
  } else {
    console.log('Play button not found');
  }

  // اغلاق المتصفح بعد وقت محدد
  setTimeout(async () => {
    await browser.close();
    console.log('Browser closed and will reopen');
  }, BROWSER_TIMEOUT);
};

const main = async () => {
  while (true) { // حلقة لا نهائية لإعادة فتح المتصفحات عند الإغلاق
    console.log('Watch again');
    const browserPromises = Array.from({ length: BROWSER_COUNT }).map(openBrowser);

    await Promise.all(browserPromises);

    console.log('All browsers opened, waiting for the timeout to close them...');
    // انتظار قبل إعادة الفتح
    await new Promise(resolve => setTimeout(resolve, BROWSER_TIMEOUT + 1000)); // ننتظر قليلا بعد اغلاق المتصفحات
  }
};

main();
