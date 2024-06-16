import { firefox } from 'playwright';
import UserAgent from 'user-agents';

// تعريفات
const URL = "https://youtube.com/shorts/sI9VgfUvoI8?si=Jw-uq4N5cQ8N9s8d";
const BROWSERS_COUNT = 5;
const WATCH_DURATION_SECONDS = 25; // مدة الانتظار بالثانية
console.log('watching');
const usedUserAgents = new Set(); // مجموعة لتخزين user agents المستخدمة
const cookiesArray = [
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=r-G7H4ciuPk56RKh/AQuAfvWqqbG67X7oy; SAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; __Secure-1PAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; __Secure-3PAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; SID=g.a000kwhxwb_cVHLJFit6lwmOjChWXqaeX6ivm01w_n__tNUtKQ0qAXJUtCFEJw6QkxZZMc_tYAACgYKAZsSARUSFQHGX2MiGzjV9H2KweJUIl8zcGyQ6xoVAUF8yKrCMO-p-ErJmebUe0MoX2OR0076; SIDCC=AKEyXzXYYS0iOiu-aicLFVVNAmvt0JXHFXqEToaakBGZ324YDFO6bfAZtuvTkn18NqMJCfsHRw',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=joVXVDRMJxwg8Uim/ADyFYjXsbAe-RGVwX; SAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; __Secure-1PAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; __Secure-3PAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; SID=g.a000kwhfiyHvdhc-LuBYYAlj-7fgvmqOf7qJcyhBqXRobX9tLY_gJiMiweJcvzAN12prg03uUgACgYKAdgSARUSFQHGX2MiABuI_nShnxLUwTn64Tle_xoVAUF8yKp88J-JqiHa-6hyqxfKKgvf0076; SIDCC=AKEyXzXTQhSsPD1vB-QLizTBOs2fAcDjpAtvV8n3uxdxhQr8Kg6J64-xjgdo86iTAKcngZ_Aog'
//باقي الكوكيز
];
// دالة لتوليد user agent فريد
async function generateUniqueUserAgent() {
  let userAgent;
  do {
    userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
  } while (usedUserAgents.has(userAgent));
  usedUserAgents.add(userAgent);
  return userAgent;
}

// دالة لتحويل الكوكيز من نص إلى كائنات
function parseCookies(cookiesString) {
  return cookiesString.split(';').map(cookie => {
    const [name, value] = cookie.split('=');
    return {
      name: name.trim(),
      value: value.trim(),
      domain: '.youtube.com',
      path: '/'
    };
  });
}

async function openBrowsers() {
  const browserInstances = [];

  for (let i = 0; i < BROWSERS_COUNT; i++) {
    browserInstances.push((async () => {
      const userAgent = await generateUniqueUserAgent();
      const browser = await firefox.launch({ headless: true });
      const contextOptions = { userAgent };
      
      // تعيين الكوكيز إذا كانت متوفرة
      if (i < cookiesArray.length) {
        contextOptions.cookies = parseCookies(cookiesArray[i]);
      }

      // إكمال إعدادات المتصفح
      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      await page.goto(URL);
      console.log('gone');
      try {
        await page.click('button[aria-label="Play"]');
        console.log(`Browser ${i+1} clicked`);
      } catch (e) {
        console.log(`Browser ${i+1} not clicked`);
      }
      await page.waitForTimeout(WATCH_DURATION_SECONDS * 1000);
      await browser.close();
    })());
  }

  // انتظار جميع المتصفحات حتى تنتهي
  await Promise.all(browserInstances);
  openBrowsers()
  console.log('watch again');
}

// بدء العملية
openBrowsers().catch(console.error);
