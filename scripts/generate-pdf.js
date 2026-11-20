// npm run pdf                       -> rebuild index.html + fe/index.html and their PDFs from data/*.json
// npm run pdf -- data/jobs/foo.json -> applications/foo/cv.html + Sam-Garg-CV.pdf
// Add --no-pdf to only write the HTML.
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
// "extends": "technical-architect" starts from data/technical-architect.json and overrides what's in this file
const load = f => {
  const d = read(f);
  if (!d.extends) return d;
  const { html, pdf, ...parent } = load(path.join(root, 'data', d.extends + '.json'));
  return { ...parent, ...d };
};

const args = process.argv.slice(2);
const files = args.filter(a => !a.startsWith('--'));
if (!files.length) fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.json')).forEach(f => files.push(path.join('data', f)));

(async () => {
  const browser = args.includes('--no-pdf') ? null : await puppeteer.launch();
  for (const f of files) {
    const slug = path.basename(f, '.json');
    const d = { compact: false, ...load(path.resolve(f)) };
    const html = path.join(root, d.html || `applications/${slug}/cv.html`);
    const pdf = path.join(root, d.pdf || `applications/${slug}/Sam-Garg-CV.pdf`);
    fs.mkdirSync(path.dirname(html), { recursive: true });
    fs.writeFileSync(html, await ejs.renderFile(path.join(__dirname, 'cv.ejs'), { ...d, pdfLink: path.basename(pdf) }));
    console.log(`Generated ${path.relative(root, html)}`);
    if (browser) {
      const page = await browser.newPage();
      await page.goto(`file://${html}`, { waitUntil: 'networkidle0' });
      await page.pdf({ path: pdf, format: 'A4', printBackground: true, margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' } });
      console.log(`Generated ${path.relative(root, pdf)}`);
      await page.close();
    }
  }
  if (browser) await browser.close();
})();
