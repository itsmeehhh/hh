import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// تعريفات
const URL = "https://youtube.com/shorts/sI9VgfUvoI8?si=Jw-uq4N5cQ8N9s8d";
const BROWSERS_COUNT = 5;
const WATCH_DURATION_SECONDS = 60; // مدة الانتظار بالثانية
const usedUserAgents = new Set(); // مجموعة لتخزين user agents المستخدمة

console.log(`watching: ${URL}`);

// دالة لتوليد user agent فريد مع معرف فريد
async function generateUniqueUserAgent() {
  let userAgent;
  do {
    userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
    // إضافة معرف فريد إلى user agent
    userAgent += ` ID/${Date.now()}${Math.random().toString().slice(2)}`;
  } while (usedUserAgents.has(userAgent)); // التحقق من التكرار
  usedUserAgents.add(userAgent); // إضافة إلى المجموعة
  return userAgent;
}



async function openBrowsers() {
  const browserInstances = [];

  for (let i = 0; i < BROWSERS_COUNT; i++) {
    browserInstances.push((async () => {
      const userAgent = await generateUniqueUserAgent();
      const browser = await firefox.launch({ headless: true });
      const context = await browser.newContext({ userAgent });
      console.log(`Browser ${i+1} userAgent: ${userAgent}`);
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
    
