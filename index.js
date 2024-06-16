const puppeteer = require('puppeteer');
const url = 'https://m.youtube.com/watch?v=u5j85Z7EMuM'
async function openBrowsers() {
  const browsers = [];
  for (let i = 0; i < 5; i++) {
    browsers.push(openBrowser());
  }

  await Promise.all(browsers).then(() => {
    console.log('watch again');
    openBrowsers(); // إعادة فتح المتصفحات بعد إغلاقها
  });
}

async function openBrowser() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  console.log('watch');
  
  await page.waitForSelector('button[aria-label="Play"]'); // استبدل بالمحدد الصحيح لأيقونة play
  await page.click('button[aria-label="Play"]'); // الضغط
  console.log('clicked');
  await new Promise(resolve => setTimeout(resolve, 60000)); // الانتظار لمدة دقيقة واحدة
  await browser.close();
}

openBrowsers(); // بدء العملية
