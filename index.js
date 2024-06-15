import { spawn } from 'child_process';
import { firefox } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import UserAgent from 'user-agents';

// تحويل URL الملف الحالي إلى مسار ملف
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = 'https://m.youtube.com/watch?v=u5j85Z7EMuM';
const browserCount = 5;
const duration = 60000; // مدة البقاء مفتوحاً بالمللي ثانية (60 ثانية = 60000 مللي ثانية)
console.log(`watchind ${url}`);
// دالة لفتح المتصفح، تُستخدم من قِبَل العملية الفرعية
async function openBrowser(url, duration, userAgent) {
    console.log(`Opening browser with userAgent: ${userAgent}`);
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
    // هذا الجزء من الكود سيتم تنفيذه فقط في العملية الفرعية
    const url = process.argv[3];
    const duration = parseInt(process.argv[4], 10);
    const userAgent = process.argv[5];
    openBrowser(url, duration, userAgent).catch(err => {
        console.error(err);
        process.exit(1);
    });
} else {
    // هذا الجزء من الكود هو الرئيسي ويتم تنفيذه مرة واحدة عند بدء البرنامج

    console.log(`watching: ${url}`);

    // الوظيفة الرئيسية لفتح المتصفحات في عمليات فرعية
    function openBrowsers() {
        const processes = [];

        // فتح المتصفحات في عمليات فرعية
        for (let i = 0; i < browserCount; i++) {
            const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
            const child = spawn('node', [__filename, 'child', url, duration, userAgent], { stdio: 'inherit' });

            processes.push(child);
        }

        return processes;
    }

    (async () => {
        while (true) {
            const processes = openBrowsers();

            // الانتظار حتى تنتهي جميع العمليات الفرعية
            await Promise.all(processes.map(p => new Promise(resolve => p.on('close', resolve))));
            console.log('watching again');
        }
    })();
}
