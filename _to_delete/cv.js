// Renders the CV from data/<name>.json. Pick one with ?cv=<name> (default: technical-architect).
// A CV file may "extends" another one and override any top-level field; see data/jobs/ for examples.
//   extraBullets: { "Citizen Watches": ["extra bullet html", ...] }  appended to that employer
//   hideCompanies: ["Funda", ...]                                      dropped from experience
(function () {
  const params = new URLSearchParams(location.search);
  const name = params.get('cv') || 'technical-architect';
  if (!/^[\w\-\/]+$/.test(name) || name.includes('..')) { document.body.textContent = 'Invalid cv name'; return; }

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  async function load(n, seen = []) {
    if (seen.includes(n)) throw new Error('Circular extends: ' + [...seen, n].join(' -> '));
    const res = await fetch(`data/${n}.json`);
    if (!res.ok) throw new Error(`data/${n}.json not found`);
    const d = await res.json();
    if (!d.extends) return d;
    const { extends: parent, ...own } = d;
    const base = await load(parent, [...seen, n]);
    delete base.out;
    return { ...base, ...own };
  }

  function experience(x) {
    const name = x.url
      ? `<a href="${esc(x.url)}" target="_blank" class="text-black no-underline hover:opacity-70 transition-opacity">${esc(x.company)}</a>`
      : esc(x.company);
    let body = '';
    if (x.intro) body += `<p class="mb-4">${x.intro}</p>`;
    if (x.bullets) body += `<ul class="pl-4 list-disc space-y-1">${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
    if (x.text) body += x.text;
    return `<div class="mb-5 leading-normal">
      <header class="font-din uppercase">
        <div class="text-xl font-bold">${name}</div>
        <div class="text-lg text-gray-400 font-normal">${x.role}</div>
      </header>
      <div class="pt-1.5 text-sm">${body}</div>
    </div>`;
  }

  function render(d) {
    document.title = d.title || 'Sam Garg';
    const setMeta = (n, v) => { const m = document.querySelector(`meta[name=${n}]`); if (m && v) m.content = v; };
    setMeta('description', d.description);
    setMeta('keywords', d.keywords);

    const pdf = document.getElementById('pdf-link');
    if (d.pdf) pdf.href = d.pdf; else pdf.parentElement.style.display = 'none';

    let exp = d.experience || [];
    const hide = d.hideCompanies || [];
    exp = exp.filter(x => !hide.some(h => x.company.startsWith(h)));
    const extra = d.extraBullets || {};
    exp = exp.map(x => {
      const key = Object.keys(extra).find(k => x.company.startsWith(k));
      return key ? { ...x, bullets: [...(x.bullets || []), ...extra[key]] } : x;
    });

    const summary = (d.summary || []).map(s => s.h ? `<h3 class="font-bold">${s.h}</h3>` : `<p>${s.p}</p>`).join('\n');
    const link = d.linkedin || {};

    document.getElementById('resume').innerHTML = `
    <header class="flex justify-between items-center border-b border-gray-400">
      <h1 class="font-bold mr-4 mb-4 leading-tight">
        <span class="block text-4xl sm:text-5xl">Sam Garg</span>
        <span class="block text-sm font-normal text-gray-500 mt-1">${d.headline}</span>
      </h1>
      <address class="not-italic text-right text-sm sm:text-base shrink-0">
        <div class="mb-1"><a href="${esc(link.url || '')}" rel="nofollow" target="_blank" class="contact-link">${esc(link.text || '')}</a></div>
        <div><a href="mailto:${esc(d.email)}" target="_blank" class="contact-link">${esc(d.email)}</a></div>
      </address>
    </header>

    <section class="summary${d.compact ? ' compact mt-6' : ' pt-9'} text-justify text-gray-900 text-base mb-12">
      ${summary}
    </section>

    <section class="w-full mb-12">
      <h2 class="font-din uppercase text-3xl mt-5 mb-4">Technical Expertise</h2>
      <div class="flex flex-wrap gap-2">${(d.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join('\n')}</div>
    </section>

    <section class="w-full mb-12">
      <h2 class="font-din uppercase text-3xl mt-5 mb-4">Work Experience</h2>
      ${exp.map(experience).join('\n')}
    </section>

    <section class="w-full">
      <h2 class="font-din uppercase text-3xl mt-5 mb-4">Education &amp; Certifications</h2>
      ${(d.education || []).map(e => `<div class="mb-5 leading-normal font-din uppercase">
        <div class="text-xl font-bold">${e.title}</div>
        <div class="text-lg text-gray-400 font-normal">${e.org}</div>
      </div>`).join('\n')}
    </section>`;
  }

  load(name)
    .then(render)
    .catch(e => { document.getElementById('resume').textContent = e.message; })
    .finally(() => (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { window.__cvReady = true; }));
})();
