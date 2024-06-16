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
  try{
  await page.waitForSelector('.icon-play, .play-button, [aria-label="Play"]'); // استبدل بالمحدد الصحيح لأيقونة play
  
  await page.click('.icon-play, .play-button, [aria-label="Play"]'); // الضغط على أيقونة 
  console.log('clicked');
  } catch (e) {
    console.log('click error');
  }
  await new Promise(resolve => setTimeout(resolve, 60000)); // الانتظار لمدة دقيقة واحدة
  await browser.close();
}

openBrowsers(); // بدء العملية
