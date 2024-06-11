import { firefox } from 'playwright'; // استيراد مكتبة بلاي رايت لمتصفح فايرفوكس

console.log("watching"); // طباعة رسالة في الكونسول

function openPage() {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await firefox.launch({ headless: true }); // إطلاق المتصفح بالوضع الخفي
      const page = await browser.newPage(); // فتح صفحة جديدة
      await page.goto('https://youtu.be/qIz9GgkWyts'); // الانتقال إلى الرابط المحدد
      await page.click('button[aria-label="Play"]'); // النقر على زر التشغيل
      await page.waitForTimeout(120000); // الانتظار لمدة دقيقتين
      resolve();
    } catch (error) {
      console.error('حدث خطأ أثناء فتح الصفحة:', error);
      reject(error);
    } finally {
      if (browser) {
        await browser.close(); // تأكد من إغلاق المتصفح حتى في حالة حدوث خطأ
      }
    }
  });
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(openPage());
  }
  await Promise.all(promises).catch(error => {
    console.error('حدث خطأ أثناء تنفيذ الوعود بالتوازي:', error);
  });
}

async function repeatForever() {
  while (true) {
    await executeInParallel();
    console.log("watching again");
  }
}

repeatForever();
