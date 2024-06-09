import { firefox } from 'playwright'; 

// دالة لفتح الصفحة والانتظار لمدة دقيقة
function openPage() {
  return new Promise(async (resolve, reject) => {
    
    const browser = await firefox.launch({ headless: true  });
    const page = await browser.newPage(); 
    await page.goto('https://youtu.be/qIz9GgkWyts?si=ethiWCZccRy78v_I');
    await page.click('button[aria-label="Play"]'); 
    await page.waitForTimeout(120000);
    await browser.close();
    resolve();
  });
}

// دالة لتنفيذ العملية 100 مرة بشكل متزامن
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
