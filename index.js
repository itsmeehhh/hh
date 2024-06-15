import { firefox } from 'playwright'; 

// دالة لفتح الصفحة والانتظار لمدة دقيقة
function openPage() {
  return new Promise(async (resolve, reject) => {
    
    const browser = await firefox.launch({ headless: true  });
    const page = await browser.newPage(); 
    await page.goto('https://m.youtube.com/watch?v=u5j85Z7EMuM');
    await page.click('button[aria-label="Play"]');
    console.log('clicked');
    await page.waitForTimeout(120000);
    await browser.close();
    resolve();
  });
}

// دالة لتنفيذ العمليات مرات متعددة بشكل متزامن
async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(openPage());
  }
  await Promise.all(promises);
}

// دالة لتكرار العملية بشكل لا نهائي
async function repeatForever() {
  while (true) {
    await executeInParallel();
  }
}

repeatForever();
