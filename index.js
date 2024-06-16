const puppeteer = require('puppeteer');

async function openBrowsers() {
  const browsers = [];
  for (let i = 0; i < 5; i++) {
    browsers.push(openBrowser());
  }

  await Promise.all(browsers).then(() => {
    console.log('جميع المتصفحات تم إغلاقها، سيتم إعادة فتحها الآن.');
    openBrowsers(); // إعادة فتح المتصفحات بعد إغلاقها
  });
}

async function openBrowser() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://fb.com');
  await new Promise(resolve => setTimeout(resolve, 60000)); // الانتظار لمدة دقيقة واحدة
  await browser.close();
}

openBrowsers(); // بدء العملية
