import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// تعريفات
const URL = "https://m.youtube.com/watch?v=u5j85Z7EMuM";
const BROWSERS_COUNT = 5;
const WATCH_DURATION_SECONDS = 60; // مدة الانتظار بالثانية

console.log(`watching: ${URL}`);

// دالة لتوليد إعدادات عشوائية للمتصفح
function generateRandomBrowserConfig() {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
// مصفوفات لإعدادات المتصفح
const viewportSizes = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1600, height: 900 },
  { width: 1280, height: 720 },
  // ... أضف المزيد حسب الحاجة
];

const locales = [
  'en-US', 'fr-FR', 'de-DE', 'es-ES', 'it-IT',
  'ar-SA', 'ru-RU', 'ja-JP', 'ko-KR', 'pt-BR',
  // ... أضف المزيد حسب الحاجة
];

const platform = [
  'Win32', 'Linux x86_64', 'MacIntel',
  'Win64', 'Linux i686', 'Linux armv7l',
  // ... أضف المزيد حسب الحاجة
];

const timezones = [
  'America/New_York', 'Europe/Paris', 'Asia/Tokyo',
  'America/Los_Angeles', 'Europe/Berlin', 'Asia/Dubai',
  // ... أضف المزيد حسب الحاجة
];

// يمكنك إضافة المزيد من المصفوفات لخصائص أخرى إذا لزم الأمر

  return {
    userAgent,
    viewport: viewportSizes[Math.floor(Math.random() * viewportSizes.length)],
    locale: locales[Math.floor(Math.random() * locales.length)],
    platform: platform[Math.floor(Math.random() * platform.length)],
    timezoneId: timezones[Math.floor(Math.random() * timezones.length)]
  };
}

async function openBrowsers() {
  const browserInstances = [];

  for (let i = 0; i < BROWSERS_COUNT; i++) {
    browserInstances.push((async () => {
      const { userAgent, viewport, locale, platform, timezoneId } = generateRandomBrowserConfig();
      const browser = await firefox.launch({ headless: true });
      const context = await browser.newContext({ userAgent, viewport, locale, platform, timezoneId });
      console.log(`Browser ${i+1} config: ${JSON.stringify({ userAgent, viewport, locale, platform, timezoneId })}`);
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
                             
