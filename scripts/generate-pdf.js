const puppeteer = require('puppeteer');
const path = require('path');

const cvs = [
  { html: '../index.html', pdf: '../Resume-SamGarg.pdf' },
  { html: '../fe/index.html', pdf: '../fe/CV-SamGarg.pdf' },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const { html, pdf } of cvs) {
    const url = `file://${path.resolve(__dirname, html)}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.resolve(__dirname, pdf),
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });
    console.log(`Generated ${pdf}`);
  }

  await browser.close();
})();
