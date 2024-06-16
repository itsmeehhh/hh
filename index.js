import { firefox } from 'playwright';
import { userAgent } from 'user-agents';

const url = 'https://fb.com'; // URL to open
const numberOfBrowsers = 5; // Number of browsers to open
const timeout = 60; // Timeout in seconds
console.log("watching", url);
function generateUserAgent(osType) {
  return new userAgent(osType).toString();
}

async function openBrowser(url, timeout) {
   // Print "watching" message
  const browser = await firefox.launch();
  const osList = ['Windows', 'Linux', 'Macintosh'];
  const os = osList[Math.floor(Math.random() * osList.length)];
  const context = await browser.newContext({
    userAgent: generateUserAgent(os),
  });
  const page = await context.newPage();
  
  await page.goto(url);
  const playButton = await page.$('button.play');
  
  if (playButton) {
    await playButton.click();
  } else {
    console.log("No play button found.");
  }
  
  setTimeout(async () => {
    await browser.close();
    console.log("watching again"); // Print "watching again" message
    await openBrowser(url, timeout); // Reopen browser after timeout
  }, timeout * 1000);
}

async function main() {
  for (let i = 0; i < numberOfBrowsers; i++) {
    await openBrowser(url, timeout);
  }
}

main();
