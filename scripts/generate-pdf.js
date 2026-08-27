const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: path.resolve(__dirname, '../Resume-SamGarg.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
  });

  await browser.close();
  console.log('Generated Resume-SamGarg.pdf');
})();
