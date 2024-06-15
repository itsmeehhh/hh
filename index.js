import { spawn } from 'child_process';
import { firefox } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as ua from 'user-agents';

// تحويل URL الملف الحالي إلى مسار ملف
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = 'https://www.fb.com';
const browserCount = 5;
const duration = 60000; // مدة البقاء مفتوحاً بالمللي ثانية (60 ثانية = 60000 مللي ثانية)

// دالة لفتح المتصفح، تُستخدم من قِبَل العملية الفرعية
async function openBrowser(url, duration, userAgent) {
    const browser = await firefox.launch();
    const context = await browser.newContext({
        userAgent: userAgent
    });
    const page = await context.newPage();
    await page.goto(url);
    console.log('done');
    // الانتظار لمدة معينة ثم إغلاق المتصفح
    await new Promise(resolve => setTimeout(resolve, duration));
    await browser.close();
}

// التحقق مما إذا كانت هذه العملية فرعية
if (process.argv[2] === 'child') {
    const url = process.argv[3];
    const duration = parseInt(process.argv[4], 10);
    const userAgent = process.argv[5];
    openBrowser(url, duration, userAgent).catch(err => {
        console.error(err);
        process.exit(1);
    });
} else {
    // الوظيفة الرئيسية لفتح المتصفحات في عمليات فرعية
    function openBrowsers() {
        const processes = [];

        // فتح المتصفحات في عمليات فرعية
        for (let i = 0; i < browserCount; i++) {
            const userAgent = new ua({ deviceCategory: 'desktop' }).toString();
            const child = spawn('node', [__filename, 'child', url, duration, userAgent]);

            child.stdout.on('data', (data) => {
                console.log(`Browser ${i + 1}: ${data}`);
            });

            child.stderr.on('data', (data) => {
                console.error(`Browser ${i + 1} error: ${data}`);
            });

            child.on('close', (code) => {
                console.log(`Browser ${i + 1} closed with code ${code}`);
            });

            processes.push(child);
        }

        return processes;
    }

    (async () => {
        while (true) {
            const processes = openBrowsers();

            // الانتظار حتى تنتهي جميع العمليات الفرعية
            await Promise.all(processes.map(p => new Promise(resolve => p.on('close', resolve))));
        }
    })();
}
