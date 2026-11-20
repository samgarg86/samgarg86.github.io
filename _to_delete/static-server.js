// Tiny dependency-free static server for the repo root (fetch() doesn't work from file://).
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };

module.exports = function start(port = 0) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(root, p);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
};
if (require.main === module) {
  require('./static-server')(3000).then(() => console.log('CV preview: http://127.0.0.1:3000/?cv=technical-architect  (or ?cv=fe, ?cv=jobs/<slug>)'));
}
