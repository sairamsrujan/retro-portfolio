import './style.css';
import { createComputerScene } from './scene.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = value => /^(https?:\/\/|mailto:|\/)/i.test(value || '') && !String(value).startsWith('//') ? escape(value) : '#';
let content;
try {
  const response = await fetch('/content.json');
  if (!response.ok) throw new Error('Content could not be loaded');
  content = await response.json();
} catch {
  document.querySelector('#intro').innerHTML = '<p>Unable to load the portfolio. Please reload the page.</p><a href="https://github.com/sairamsrujan">Visit GitHub</a>';
  throw new Error('Portfolio content unavailable');
}
const { profile, projects, skills, experience, settings } = content;
document.title = `${profile.name} — Portfolio`;
document.querySelector('meta[name="description"]').content = `${profile.name} — ${profile.tagline}`;
document.querySelector('#year').textContent = new Date().getFullYear();
document.documentElement.style.setProperty('--desktop-color', settings.desktopColor);

function icon(type, className = '') {
  const shapes = {
    folder: '<path fill="#67b8db" d="M3 12h16l5 5h36v37H3z"/><path fill="#a0d9ed" d="M3 17h57v37H3z"/><path stroke="#4285a4" d="M4 20h55"/>',
    about: '<rect x="9" y="6" width="46" height="51" rx="4" fill="#d3cdb5"/><circle cx="32" cy="24" r="9" fill="#8f9a96"/><path fill="#8f9a96" d="M17 46c0-17 30-17 30 0"/><path stroke="#727b76" d="M19 51h26"/>',
    contact: '<circle cx="32" cy="31" r="26" fill="#78a8b6"/><path stroke="#e4ebd3" fill="none" d="M6 31h52M32 5c-23 15-23 38 0 52M32 5c23 15 23 38 0 52M11 15h42M11 46h42"/><path fill="#fffef1" d="M18 27h38v26H18z"/><path fill="none" stroke="#657975" d="m18 28 19 14 19-14"/>',
    skills: '<rect x="7" y="6" width="49" height="51" rx="6" fill="#7ab16b"/><path stroke="#e8f1d8" stroke-width="5" d="M18 45V30m10 15V19m10 26V25m10 20V13"/>',
    terminal: '<rect x="6" y="7" width="51" height="50" rx="7" fill="#262b32"/><path stroke="#b8d5a1" stroke-width="3" fill="none" d="m17 23 8 7-8 7m14 0h11"/><path stroke="#6d747c" d="M12 13h5m3 0h5m3 0h5"/>',
    algorithms: '<rect x="8" y="8" width="47" height="48" rx="6" fill="#e6d6bf"/><path fill="#edb559" d="m9 21 26-9 12 22-26 11z"/><path fill="#be84b8" d="m25 30 26 6-6 18-26-6z"/><path fill="#a7c577" d="m9 21 9 28 11-15z"/>',
    document: '<path fill="#fffef2" d="M12 4h29l12 12v43H12z"/><path fill="#b5b7a9" d="M41 4v13h12"/><path stroke="#87928e" d="M20 26h24M20 32h24M20 38h24M20 44h19M20 50h22"/>',
    resume: '<path fill="#f5eed6" d="M13 5h37v53H13z"/><path stroke="#8d9994" d="M20 17h23M20 24h23M20 31h23M20 38h16"/><path fill="#b86455" d="M7 44h49v14H7z"/><text x="32" y="54" fill="white" text-anchor="middle" font-size="10" stroke="none" font-family="monospace">PDF</text>',
    trash: '<path fill="#b4c5bc" d="m13 15 4 42h31l4-42z"/><path fill="#d0d9cc" d="M10 12h46v7H10zM24 7h17v5H24z"/><path stroke="#728e81" d="m23 24 2 25m8-25v25m10-25-2 25"/>',
    game: '<rect x="7" y="8" width="49" height="48" rx="6" fill="#a7b68a"/><path stroke="#3e633a" stroke-width="7" fill="none" d="M18 42V22h17v13h10"/><rect x="42" y="17" width="6" height="6" fill="#a74e3e"/>',
    search: '<circle cx="28" cy="26" r="17" fill="#bad3d0"/><path stroke="#5d7f7d" stroke-width="7" d="m40 39 14 15"/><circle cx="28" cy="26" r="12" fill="#e2eeeb"/><path stroke="#91b4ae" d="M20 26h16m-8-8v16"/>',
    brain: '<path fill="#b5a8c9" d="M31 10c-15-14-30 9-22 20-12 17 4 29 21 20 16 10 35-6 23-20 9-13-7-33-22-20z"/><path stroke="#7e6b95" fill="none" d="M31 13v37M18 16l7 10-7 9 7 9M44 15l-7 10 7 10-7 10"/>',
    tag: '<path fill="#d9b55f" d="M5 7h27l27 27-25 25L5 30z"/><circle cx="19" cy="19" r="5" fill="#f9f1d8"/><path stroke="#ac8b43" d="m28 32 13 13m-8-18 13 13"/>',
    graph: '<path stroke="#628f79" stroke-width="3" d="m12 16 20 17 20-19-9 37-31-5 20-13 11 18"/><g fill="#8eb99d"><circle cx="12" cy="16" r="7"/><circle cx="32" cy="33" r="8"/><circle cx="52" cy="14" r="7"/><circle cx="43" cy="51" r="7"/><circle cx="12" cy="46" r="7"/></g>',
    book: '<path fill="#8ca7b1" d="M6 10h15v46H6z"/><path fill="#b8ad84" d="M24 5h15v51H24z"/><path fill="#ab7c6d" d="m41 14 13-4 13 42-13 4z"/><path stroke="#e1dfcc" d="M10 18h7M10 45h7M28 14h7M28 45h7m11-22 6-2"/>',
  };
  return `<svg class="app-icon ${className}" viewBox="0 0 64 64" aria-hidden="true" stroke="#626d67" stroke-width="1.3" stroke-linejoin="round">${shapes[type] || shapes.folder}</svg>`;
}

const appInfo = {
  about: { title: 'About', icon: 'about' },
  projects: { title: 'Projects', icon: 'folder' },
  contact: { title: 'Contact', icon: 'contact' },
  skills: { title: 'Skills', icon: 'skills' },
  terminal: { title: 'Terminal', icon: 'terminal' },
  algorithms: { title: 'Algorithms', icon: 'algorithms' },
  resume: { title: 'Résumé', icon: 'resume' },
  readme: { title: 'readme.txt', icon: 'document' },
  trash: { title: 'Trash', icon: 'trash' },
  game: { title: 'Snake', icon: 'game' },
};
const desktop = document.createElement('section');
desktop.id = 'desktop'; desktop.className = 'desktop'; desktop.setAttribute('aria-label', 'Interactive portfolio desktop');
desktop.tabIndex = -1; desktop.inert = true;
desktop.innerHTML = `
  <header class="menubar"><button class="os-menu-trigger" aria-label="Open application menu" aria-expanded="false">▦</button><button class="active-app-name" data-app="about">About</button><div class="menubar-right"><span class="menubar-user">${escape(profile.shortName)}</span><span class="menu-divider"></span><button class="help-button" data-app="readme" aria-label="Help">?</button><time id="clock"></time></div></header>
  <div class="os-menu" hidden>${Object.entries(appInfo).filter(([id]) => id !== 'trash').map(([id, app]) => `<button data-app="${id}">${icon(app.icon)} ${app.title}</button>`).join('')}<hr><button data-action="leave">↶ Back to the desk</button></div>
  <div class="desktop-shortcuts">${[['projects', 'Applications'], ['game', 'Snake'], ['algorithms', 'Algorithms'], ['readme', 'readme.txt']].map(([id, label]) => `<button class="shortcut" data-app="${id}" title="Open ${label}">${icon(appInfo[id].icon)}<span>${label}</span></button>`).join('')}</div>
  <div class="windows" id="windows"></div>
  <div class="desktop-watermark">srujanOS <span>personal edition</span></div>
  <nav class="dock" aria-label="Applications">${['projects', 'about', 'contact', 'algorithms', 'skills', 'terminal', 'resume', 'readme', 'trash'].map((id, i) => `${i === 6 ? '<span class="dock-divider"></span>' : ''}<button class="dock-item" data-app="${id}" aria-label="${appInfo[id].title}" title="${appInfo[id].title}">${icon(appInfo[id].icon)}<span class="dock-tooltip">${appInfo[id].title}</span><span class="running-dot"></span></button>`).join('')}</nav>`;

let scene;
try { scene = createComputerScene(desktop); }
catch { document.body.classList.add('no-webgl'); document.querySelector('#screen-layer').appendChild(desktop); }
let started = false, direct = false, sound = settings.soundEnabled, audio;
const windows = new Map(); let zIndex = 20;
function playTone() {
  if (!sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(660, audio.currentTime);
    gain.gain.setValueAtTime(.035, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .12);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .12);
  } catch { /* Audio is optional. */ }
}
function setDirect(value) {
  direct = value; document.body.classList.toggle('direct-view', direct);
  desktop.classList.toggle('direct-desktop', direct);
  scene?.setDirect(direct);
  document.querySelector('#view-toggle').setAttribute('aria-label', direct ? 'Switch to 3D view' : 'Switch to desktop view');
  document.querySelector('#view-toggle').title = direct ? 'Switch to 3D view' : 'Switch to desktop view';
}
function enter() {
  if (started) return;
  started = true; desktop.inert = false;
  document.body.classList.add('started'); scene?.enter(); playTone();
  if (innerWidth < 740 || !scene) setDirect(true);
  desktop.focus({ preventScroll: true });
}
function leave() {
  setDirect(false); started = false; desktop.inert = true;
  document.body.classList.remove('started'); scene?.reset();
  document.querySelector('#start-button').focus();
}
document.querySelector('#start-button').addEventListener('click', enter);
document.querySelector('#scene').addEventListener('click', enter);
document.querySelector('#intro').addEventListener('click', enter);
document.querySelector('#view-toggle').addEventListener('click', () => { if (!started) { enter(); setDirect(true); } else setDirect(!direct); });
document.querySelector('#sound-toggle').addEventListener('click', () => {
  sound = !sound;
  document.querySelector('#sound-toggle').classList.toggle('sound-on', sound);
  document.querySelector('#sound-toggle').setAttribute('aria-label', sound ? 'Mute sound' : 'Enable sound'); playTone();
});
document.querySelector('.skip-link').addEventListener('click', () => { enter(); setDirect(true); });
function toast(message) {
  const note = document.createElement('div'); note.className = 'toast'; note.textContent = message;
  document.querySelector('#toasts').appendChild(note); setTimeout(() => note.remove(), 3500);
}
function updateClock() {
  desktop.querySelector('#clock').textContent = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).replace(',', '');
}
updateClock(); setInterval(updateClock, 1000 * 30);

const link = (url, text, cls = '') => `<a class="${cls}" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${escape(text)} ↗</a>`;
const resumeLink = () => profile.resumeUrl ? `<a class="retro-button" href="${safeUrl(profile.resumeUrl)}" download>Download résumé ↓</a>` : '<p class="muted">Résumé will be available here soon.</p>';
function home() {
  return `<div class="home-content"><div class="home-mark">${icon('terminal')}</div><p class="eyebrow">HELLO, WORLD.</p><h1>${escape(profile.name)}</h1><p class="home-role">${escape(profile.role)}</p><div class="home-nav">${['About', 'Experience', 'Projects', 'Contact'].map(page => `<button class="retro-button" data-page="${page.toLowerCase()}">${page}</button>`).join('')}</div><p class="home-bottom">Make yourself at home. There’s plenty to click.</p></div>`;
}
function sideNav(page) {
  return `<aside class="sidebar"><strong>${escape(profile.shortName)}</strong>${['Home', 'About', 'Experience', 'Projects', 'Contact'].map(p => `<button class="retro-button ${page === p.toLowerCase() ? 'selected' : ''}" data-page="${p.toLowerCase()}">${p}</button>`).join('')}<span class="sidebar-footer">EST. ON THE INTERNET</span></aside>`;
}
function about() {
  return `<h1>Welcome</h1><p>${escape(profile.welcome)}</p><p>Explore my projects, try the terminal, or say hello through the ${link(profile.github, 'GitHub profile')}.</p><div class="resume-callout">${icon('resume')}<div><h2>Looking for my résumé?</h2>${resumeLink()}</div></div><h2>About my work</h2>${profile.avatarUrl ? `<img class="profile-photo" src="${safeUrl(profile.avatarUrl)}" alt="${escape(profile.name)}">` : ''}${profile.about.map(p => `<p>${escape(p)}</p>`).join('')}<h2>Currently on my workbench</h2><p>Grounded answers, transparent models, and useful developer tools. My GitHub repositories cover retrieval-augmented generation, document intelligence, annotation, and machine learning.</p><button class="retro-button" data-page="projects">Browse the projects →</button>`;
}
function experiencePage() {
  return `<h1>Experience</h1><p class="page-intro">A little of the journey so far.</p>${experience.map(e => `<article class="experience-item"><span class="date-label">${escape(e.period)}</span><h2>${escape(e.title)}</h2><p class="organization">${escape(e.organization)}</p><p>${escape(e.description)}</p>${e.url ? link(e.url, 'View work') : ''}</article>`).join('')}<div class="note-box">This section currently reflects public GitHub information. More background will be added with my résumé.</div>`;
}
function projectCards(query = '') {
  const filtered = projects.filter(p => `${p.name} ${p.description} ${p.language} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return filtered.length ? filtered.map(p => `<button class="project-card" data-project="${escape(p.id)}">${icon(p.icon)}<span><strong>${escape(p.name)}</strong><span class="project-language">${escape(p.language)}</span><span class="project-description">${escape(p.description)}</span></span><span class="project-arrow">↗</span></button>`).join('') : '<p class="empty-state">No projects found. Try “Python”, “RAG”, or “data”.</p>';
}
let projectSearchId = 0;
function projectsPage() {
  const inputId = `project-search-${++projectSearchId}`;
  return `<h1>Selected projects</h1><p class="page-intro">Ideas turned into working software. Open a folder to explore.</p><label class="search-label" for="${inputId}">Find a project</label><input id="${inputId}" class="retro-input project-search" type="search" placeholder="Search by name, technology, or idea…" autocomplete="off"><div class="project-list">${projectCards()}</div><div class="projects-footer">${projects.length} selected projects · ${link(profile.github + '?tab=repositories', 'All repositories on GitHub')}</div>`;
}
function projectDetail(id) {
  const p = projects.find(p => p.id === id); if (!p) return;
  const winId = `project-${id}`;
  openWindow(winId, `${p.name}`, `<div class="project-detail"><div class="project-detail-heading">${icon(p.icon)}<div><p class="eyebrow">PROJECT FILE</p><h1>${escape(p.name)}</h1></div></div><p>${escape(p.description)}</p><div class="tags">${[p.language, ...p.tags].filter(Boolean).map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="project-links">${link(p.github, 'View source code', 'retro-button')}${p.demo ? link(p.demo, 'Launch live project', 'retro-button') : ''}</div><p class="muted source-note">Description and technologies from the public GitHub repository.</p></div>`, 'folder');
}
function contactPage() {
  return `<h1>Let’s connect.</h1><p>${escape(profile.tagline)}</p><p>Have a question about a project or want to talk about an idea? Here’s where to find me.</p><div class="contact-links">${link(profile.github, 'GitHub — ' + profile.githubUsername, 'contact-link')}${profile.email ? `<a class="contact-link" href="mailto:${escape(profile.email)}">Email — ${escape(profile.email)} ↗</a>` : ''}${profile.linkedin ? link(profile.linkedin, 'LinkedIn', 'contact-link') : ''}</div>${profile.location ? `<p class="muted">Based in ${escape(profile.location)}</p>` : ''}<div class="contact-stamp">${icon('contact')}<span>GOOD THINGS START<br>WITH A CONVERSATION.</span></div>`;
}
function portfolioPage(page = 'home') {
  if (page === 'home') return home();
  const render = { about, experience: experiencePage, projects: projectsPage, contact: contactPage }[page] || about;
  return `<div class="portfolio-layout">${sideNav(page)}<main class="page-content">${render()}</main></div>`;
}
function appContent(id) {
  switch (id) {
    case 'about': return home();
    case 'projects': return `<div class="standalone-content">${projectsPage()}</div>`;
    case 'contact': return `<div class="standalone-content">${contactPage()}</div>`;
    case 'skills': return `<div class="standalone-content"><h1>My toolbox</h1><p class="page-intro">Technologies and techniques used across my public projects.</p>${skills.map((group, i) => `<section class="skill-group"><h2><span>0${i + 1}</span>${escape(group.title)}</h2><div class="tags">${group.items.map(s => `<span>${escape(s)}</span>`).join('')}</div></section>`).join('')}</div>`;
    case 'resume': return `<div class="standalone-content resume-page">${icon('resume')}<h1>Résumé</h1>${resumeLink()}<p>For now, you can explore my projects and public work on GitHub.</p>${link(profile.github, 'Visit my GitHub', 'retro-button')}</div>`;
    case 'readme': return `<div class="standalone-content readme"><h1>readme.txt</h1><p>Welcome to ${escape(profile.shortName)}’s personal computer.</p><hr><h2>A quick field guide</h2><p>• Click an icon in the dock to open an app.<br>• Drag a title bar to move a window.<br>• Use − to minimize, □ to maximize, and × to close.<br>• The ▣ button switches between 3D and full desktop views.<br>• Press Escape to close the active window.<br>• Try <code>help</code> in the Terminal.<br>• Open Snake for a short break.</p><h2>Under the hood</h2><p>Built with JavaScript, Three.js, and a little nostalgia. Projects are sourced from GitHub. The computer, keyboard, plants, and icons are original procedural artwork.</p><p>Experience inspired by ${link('https://joeyderuiter.me/', 'Joey de Ruiter’s portfolio')}.</p></div>`;
    case 'trash': return `<div class="empty-state trash-empty">${icon('trash')}<h1>Nothing to see here.</h1><p>The trash is empty. All good ideas are still on the desktop.</p></div>`;
    case 'terminal': return `<div class="terminal-content"><div class="terminal-output" role="log" aria-live="polite"><div>srujanOS [Version 1.0]<br>Welcome, visitor. Type <span class="terminal-accent">help</span> to get started.<br><br></div></div><form class="terminal-form"><label for="terminal-input">visitor@portfolio:~$</label><input id="terminal-input" autocomplete="off" spellcheck="false" aria-label="Terminal command"></form></div>`;
    case 'algorithms': return `<div class="standalone-content"><p class="eyebrow">A LITTLE COMPUTER SCIENCE</p><h1>Sorting, made visible.</h1><p>Watch bubble sort compare neighboring values and move the largest ones to the right.</p><div id="sort-bars" class="sort-bars" role="img" aria-label="Unsorted bars"></div><div class="algorithm-controls"><button class="retro-button" data-action="sort-start">Start sorting</button><button class="retro-button" data-action="sort-reset">Shuffle</button><label>Speed <select id="sort-speed" class="retro-input"><option value="220">Slow</option><option value="80" selected>Normal</option><option value="20">Fast</option></select></label></div><p id="sort-status" class="muted" aria-live="polite">Ready when you are. 18 values, one simple algorithm.</p></div>`;
    case 'game': return `<div class="standalone-content game-content"><div class="game-heading"><h1>Snake</h1><span>Score: <strong id="snake-score">0</strong></span></div><canvas id="snake-canvas" width="400" height="280" tabindex="0" aria-label="Snake game board. Use arrow keys or WASD."></canvas><p id="snake-status" aria-live="polite">A familiar little distraction. Ready?</p><button class="retro-button" data-action="snake-start">Start game</button><div class="game-pad" aria-label="Game controls"><button class="retro-button" data-direction="up" aria-label="Move up">↑</button><span><button class="retro-button" data-direction="left" aria-label="Move left">←</button><button class="retro-button" data-direction="down" aria-label="Move down">↓</button><button class="retro-button" data-direction="right" aria-label="Move right">→</button></span></div><p class="muted">Arrow keys / WASD to move · Space to pause</p></div>`;
  }
}
function focusWindow(id) {
  const state = windows.get(id); if (!state) return;
  for (const other of windows.values()) other.el.classList.remove('active-window');
  state.el.hidden = false; state.el.classList.add('active-window'); state.el.style.zIndex = ++zIndex;
  document.querySelector('.active-app-name').textContent = state.title;
}
function updateDock() {
  for (const button of desktop.querySelectorAll('.dock-item')) button.classList.toggle('running', windows.has(button.dataset.app));
}
function openWindow(id, title, html, windowIcon = appInfo[id]?.icon || 'folder') {
  if (windows.has(id)) { focusWindow(id); return windows.get(id).el; }
  const el = document.createElement('article'); el.className = `retro-window app-${id} active-window`; el.setAttribute('aria-label', title);
  el.setAttribute('role', 'region'); el.dataset.window = id;
  const count = windows.size;
  el.style.left = `${Math.min(120 + count * 24, 270)}px`; el.style.top = `${Math.min(105 + count * 22, 240)}px`;
  el.innerHTML = `<header class="window-titlebar"><div class="window-title">${icon(windowIcon)}<span>${escape(title)}</span></div><div class="window-controls"><button data-window-action="minimize" aria-label="Minimize ${escape(title)}">−</button><button data-window-action="maximize" aria-label="Maximize ${escape(title)}">□</button><button data-window-action="close" aria-label="Close ${escape(title)}">×</button></div></header><div class="window-body">${html}</div><footer class="window-status"><span>${escape(profile.shortName)}’s personal computer</span><span class="resize-grip">◢</span></footer>`;
  desktop.querySelector('#windows').appendChild(el); windows.set(id, { el, title }); focusWindow(id); updateDock(); playTone();
  el.addEventListener('pointerdown', () => focusWindow(id));
  const bar = el.querySelector('.window-titlebar');
  bar.addEventListener('dblclick', e => { if (!e.target.closest('button')) el.classList.toggle('maximized'); });
  bar.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || el.classList.contains('maximized') || (direct && innerWidth < 740)) return;
    const rect = desktop.getBoundingClientRect(), scale = rect.width / desktop.offsetWidth;
    const start = { x: event.clientX, y: event.clientY, left: el.offsetLeft, top: el.offsetTop };
    bar.setPointerCapture(event.pointerId);
    const move = e => {
      el.style.left = `${Math.max(0, Math.min(desktop.clientWidth - el.offsetWidth, start.left + (e.clientX - start.x) / scale))}px`;
      el.style.top = `${Math.max(30, Math.min(desktop.clientHeight - 110, start.top + (e.clientY - start.y) / scale))}px`;
    };
    const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up, { once: true });
  });
  if (id === 'terminal') initTerminal(el);
  if (id === 'algorithms') resetSort();
  if (id === 'game') initSnake();
  return el;
}
function closeWindow(id) {
  const state = windows.get(id); if (!state) return;
  state.el.remove(); windows.delete(id); updateDock();
  if (id === 'game') stopSnake();
  if (id === 'algorithms') { sortRunning = false; clearTimeout(sortTimer); }
  const visible = [...windows.entries()].filter(([, s]) => !s.el.hidden);
  if (visible.length) focusWindow(visible.at(-1)[0]); else document.querySelector('.active-app-name').textContent = 'Desktop';
}
function openApp(id) { if (!appInfo[id]) return; openWindow(id, appInfo[id].title, appContent(id)); }

desktop.addEventListener('click', e => {
  const app = e.target.closest('[data-app]');
  if (app) { openApp(app.dataset.app); closeMenu(); }
  const page = e.target.closest('[data-page]');
  if (page) { const el = openWindow('about', 'About', home()); el.querySelector('.window-body').innerHTML = portfolioPage(page.dataset.page); }
  const project = e.target.closest('[data-project]'); if (project) projectDetail(project.dataset.project);
  const action = e.target.closest('[data-window-action]');
  if (action) {
    const el = action.closest('.retro-window'), id = el.dataset.window;
    if (action.dataset.windowAction === 'close') closeWindow(id);
    else if (action.dataset.windowAction === 'minimize') { el.hidden = true; const next = [...windows.entries()].reverse().find(([, s]) => !s.el.hidden); if (next) focusWindow(next[0]); else document.querySelector('.active-app-name').textContent = 'Desktop'; }
    else { el.classList.toggle('maximized'); action.setAttribute('aria-label', `${el.classList.contains('maximized') ? 'Restore' : 'Maximize'} ${windows.get(id).title}`); }
  }
  const control = e.target.closest('[data-action]');
  if (control) {
    if (control.dataset.action === 'leave') leave();
    if (control.dataset.action === 'sort-start') toggleSort();
    if (control.dataset.action === 'sort-reset') resetSort();
    if (control.dataset.action === 'snake-start') startSnake();
  }
  const direction = e.target.closest('[data-direction]'); if (direction) changeSnakeDirection(direction.dataset.direction);
});
desktop.addEventListener('input', e => { if (e.target.classList.contains('project-search')) e.target.closest('.window-body').querySelector('.project-list').innerHTML = projectCards(e.target.value); });
const menu = desktop.querySelector('.os-menu'), menuButton = desktop.querySelector('.os-menu-trigger');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); });
document.addEventListener('pointerdown', e => { if (!e.target.closest('.os-menu, .os-menu-trigger')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMenu(); const active = desktop.querySelector('.active-window:not([hidden])'); if (active) closeWindow(active.dataset.window); }
});

function initTerminal(el) {
  const form = el.querySelector('form'), input = el.querySelector('input'), output = el.querySelector('.terminal-output');
  const history = []; let historyIndex = 0;
  function print(text, cls = '') { const line = document.createElement('div'); line.className = cls; line.textContent = text; output.appendChild(line); }
  form.addEventListener('submit', e => {
    e.preventDefault(); const command = input.value.trim(); if (!command) return;
    history.push(command); historyIndex = history.length; print(`visitor@portfolio:~$ ${command}`, 'terminal-prompt'); input.value = '';
    const [cmd, ...args] = command.toLowerCase().split(/\s+/);
    switch (cmd) {
      case 'help': print('Available commands:\n  about      A quick introduction\n  projects   List selected work\n  skills     Show my toolbox\n  github     Open my GitHub profile\n  open <app> Open an application\n  ls         List applications\n  date       What time is it?\n  whoami     A familiar question\n  clear      A fresh start'); break;
      case 'about': print(`${profile.name}\n${profile.role}\n\n${profile.welcome}`); break;
      case 'projects': print(projects.map(p => `${p.name.padEnd(20)} ${p.language}\n${p.github}`).join('\n\n')); break;
      case 'skills': print(skills.map(g => `${g.title}: ${g.items.join(', ')}`).join('\n\n')); break;
      case 'github': { const a = document.createElement('a'); a.href = profile.github; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = profile.github + ' ↗'; output.appendChild(a); break; }
      case 'open': if (appInfo[args[0]]) { openApp(args[0]); print(`Opening ${args[0]}…`); } else print('App not found. Use ls to see the available apps.'); break;
      case 'ls': print(Object.keys(appInfo).join('  ')); break;
      case 'date': print(new Date().toLocaleString()); break;
      case 'whoami': print('visitor — curious minds are always welcome here.'); break;
      case 'clear': output.replaceChildren(); break;
      default: print(`Command not found: ${cmd}. Type help to explore.`);
    }
    output.scrollTop = output.scrollHeight;
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ''; }
    if (e.key === 'ArrowDown') { e.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ''; }
  });
}

let bars = [], sortRunning = false, sortTimer, sortI = 0, sortJ = 0, comparisons = 0;
function drawBars(active = [], done = false) {
  const area = desktop.querySelector('#sort-bars'); if (!area) return;
  area.innerHTML = bars.map((n, i) => `<span class="sort-bar ${active.includes(i) ? 'comparing' : ''} ${done || i >= bars.length - sortI ? 'sorted' : ''}" style="height:${n}%"><small>${n}</small></span>`).join('');
  area.setAttribute('aria-label', `${done ? 'Sorted' : 'Sorting'} values: ${bars.join(', ')}`);
}
function resetSort() {
  clearTimeout(sortTimer); sortRunning = false; sortI = 0; sortJ = 0; comparisons = 0;
  bars = Array.from({ length: 18 }, (_, i) => 10 + i * 5);
  for (let i = bars.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bars[i], bars[j]] = [bars[j], bars[i]]; }
  drawBars(); const btn = desktop.querySelector('[data-action="sort-start"]'); if (btn) btn.textContent = 'Start sorting';
  const status = desktop.querySelector('#sort-status'); if (status) status.textContent = 'Ready when you are. 18 values, one simple algorithm.';
}
function toggleSort() {
  if (sortI >= bars.length - 1) resetSort();
  sortRunning = !sortRunning; const btn = desktop.querySelector('[data-action="sort-start"]'); btn.textContent = sortRunning ? 'Pause' : 'Resume';
  if (sortRunning) stepSort(); else clearTimeout(sortTimer);
}
function stepSort() {
  if (!sortRunning || !desktop.querySelector('#sort-bars')) return;
  if (sortI >= bars.length - 1) {
    sortRunning = false; drawBars([], true); desktop.querySelector('#sort-status').textContent = `All sorted! ${comparisons} comparisons. Time complexity: O(n²).`;
    desktop.querySelector('[data-action="sort-start"]').textContent = 'Sort again'; return;
  }
  if (bars[sortJ] > bars[sortJ + 1]) [bars[sortJ], bars[sortJ + 1]] = [bars[sortJ + 1], bars[sortJ]];
  comparisons++; drawBars([sortJ, sortJ + 1]);
  desktop.querySelector('#sort-status').textContent = `Pass ${sortI + 1} · ${comparisons} comparisons · Orange bars are being compared.`;
  sortJ++; if (sortJ >= bars.length - sortI - 1) { sortJ = 0; sortI++; }
  sortTimer = setTimeout(stepSort, Number(desktop.querySelector('#sort-speed').value));
}

let snake = [], food, snakeDir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 }, snakeTimer, snakePlaying = false, snakePaused = false, score = 0;
function newFood() { do { food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 14) }; } while (snake.some(s => s.x === food.x && s.y === food.y)); }
function initSnake() { snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]; newFood(); drawSnake(); }
function drawSnake() {
  const canvas = desktop.querySelector('#snake-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#b4bf9c'; ctx.fillRect(0, 0, 400, 280);
  ctx.strokeStyle = '#a6b48f'; ctx.lineWidth = .5;
  for (let x = 0; x <= 400; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 280); ctx.stroke(); }
  for (let y = 0; y <= 280; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke(); }
  ctx.fillStyle = '#9d5440'; ctx.fillRect(food.x * 20 + 4, food.y * 20 + 4, 12, 12);
  snake.forEach((s, i) => { ctx.fillStyle = i ? '#4e6941' : '#2f4a2a'; ctx.fillRect(s.x * 20 + 1, s.y * 20 + 1, 18, 18); });
}
function stopSnake() { clearInterval(snakeTimer); snakePlaying = false; }
function startSnake() {
  stopSnake(); score = 0; snakePaused = false; snakeDir = { x: 1, y: 0 }; nextDir = { ...snakeDir }; initSnake(); snakePlaying = true;
  desktop.querySelector('#snake-score').textContent = score; desktop.querySelector('#snake-status').textContent = 'Go get that little red square.';
  desktop.querySelector('[data-action="snake-start"]').textContent = 'Restart'; desktop.querySelector('#snake-canvas').focus();
  snakeTimer = setInterval(() => {
    if (snakePaused || document.hidden || windows.get('game')?.el.hidden || !windows.get('game')?.el.classList.contains('active-window')) return;
    snakeDir = { ...nextDir }; const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };
    const eating = head.x === food.x && head.y === food.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 14 || body.some(s => s.x === head.x && s.y === head.y)) { stopSnake(); desktop.querySelector('#snake-status').textContent = `Game over. ${score} points. One more try?`; return; }
    snake.unshift(head);
    if (eating) {
      score += 10; desktop.querySelector('#snake-score').textContent = score; playTone();
      if (snake.length === 280) { stopSnake(); desktop.querySelector('#snake-status').textContent = 'You filled the board. You win!'; drawSnake(); return; }
      newFood();
    } else snake.pop();
    drawSnake();
  }, 145);
}
function changeSnakeDirection(name) {
  const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const d = map[name]; if (d && !(d.x === -snakeDir.x && d.y === -snakeDir.y)) nextDir = d;
}
document.addEventListener('keydown', e => {
  if (!snakePlaying || !windows.get('game')?.el.classList.contains('active-window') || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  const direction = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' }[e.key];
  if (direction) { e.preventDefault(); changeSnakeDirection(direction); }
  if (e.code === 'Space') { e.preventDefault(); snakePaused = !snakePaused; desktop.querySelector('#snake-status').textContent = snakePaused ? 'Paused. Press Space to continue.' : 'Go get that little red square.'; }
});
openApp(settings.defaultApp || 'about');
if (!settings.showSceneOnLoad) { enter(); setDirect(true); }
