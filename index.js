import { firefox } from 'playwright'; 
let url = "https://youtu.be/qIz9GgkWyts";
console.log(`watching : ${url}`);
function openPage() {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await firefox.launch({ headless: true }); 
      const page = await browser.newPage(); 
      await page.goto(url, { timeout: 60000 });
      await page.click('button[aria-label="Play"]'); 
      await page.waitForTimeout(120000); 
      resolve();
    } catch (error) {
      console.error('error:', error);
      reject(error);
    } finally {
      if (browser) {
        await browser.close(); 
      }
    }
  });
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 20; i++) {
    promises.push(openPage());
  }
  await Promise.all(promises).catch(error => {
    console.error('error run the codes :', error);
  });
}

async function repeatForever() {
  while (true) {
    await executeInParallel();
    console.log(`watching again : ${url}`);
  }
}

repeatForever();
