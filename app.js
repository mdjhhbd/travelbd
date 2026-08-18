// ============ LANGUAGE & TRANSLATION ============
let LANG = 'bn'; // 'bn' or 'en'

const TRANSLATIONS = {
  'bn': {
    'login': 'লগইন করুন',
    'signup': 'সাইন আপ করুন',
    'logout': 'লগআউট',
    'email': 'ইমেইল',
    'password': 'পাসওয়ার্ড',
    'name': 'নাম',
    'phone': 'ফোন নম্বর',
    'visited': 'ভ্রমণ সম্পন্ন',
    'progress': 'আমার প্রোগ্রেস',
    'home': 'হোম',
    'explore': 'সব জেলা',
    'seasons': '৬ ঋতুর গাইড',
    'itinerary': 'ভ্রমণ পরিকল্পনা',
    'trainmap': 'ট্রেন ম্যাপ',
    'services': 'সেবা',
    'save': 'সংরক্ষণ করুন',
    'cancel': 'বাতিল',
    'delete': 'মুছে ফেলুন',
    'add': 'যোগ করুন',
    'edit': 'সম্পাদনা',
    'note': 'নোট',
    'date': 'তারিখ',
    'cost': 'খরচ (টাকা)',
  },
  'en': {
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Logout',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    'phone': 'Phone',
    'visited': 'Visited',
    'progress': 'My Progress',
    'home': 'Home',
    'explore': 'All Districts',
    'seasons': '6 Seasons Guide',
    'itinerary': 'Itinerary',
    'trainmap': 'Train Map',
    'services': 'Services',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'add': 'Add',
    'edit': 'Edit',
    'note': 'Note',
    'date': 'Date',
    'cost': 'Cost (Taka)',
  }
};

function t(key) {
  return TRANSLATIONS[LANG][key] || key;
}

function toggleLanguage() {
  LANG = LANG === 'bn' ? 'en' : 'bn';
  localStorage.setItem('lang', LANG);
  render();
}

// ============ STORAGE & AUTH ============
let CURRENT_USER = null;
let IS_ADMIN = false;
let ROUTE = { page: 'home', districtId: null };

async function sget(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function sset(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function sdel(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ============ AUTHENTICATION ============
function switchToSignup() {
  document.getElementById('authContainer').innerHTML = `
    <div class="login-card">
      <div class="flag-big"></div>
      <h1>${LANG === 'bn' ? 'সাইন আপ করুন' : 'Sign Up'}</h1>
      <p>${LANG === 'bn' ? 'একটি নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account'}</p>
      <input id="signupName" type="text" placeholder="${t('name')}">
      <input id="signupEmail" type="email" placeholder="${t('email')}">
      <input id="signupPhone" type="tel" placeholder="${t('phone')}">
      <input id="signupPassword" type="password" placeholder="${t('password')}">
      <button onclick="doSignup()">${t('signup')}</button>
      <div class="login-divider">${LANG === 'bn' ? 'অথবা' : 'OR'}</div>
      <button onclick="switchToLogin()" style="background:var(--gold);color:#241a04;">${LANG === 'bn' ? 'আমার অ্যাকাউন্ট আছে' : 'I have an account'}</button>
    </div>
    <div class="login-card" style="background:linear-gradient(135deg,var(--green-soft),#f0f8f5);">
      <h3 style="color:var(--green-deep);margin-top:0;">${LANG === 'bn' ? 'বাংলাদেশ এক্সপ্লোর ��রুন!' : 'Explore Bangladesh!'}</h3>
      <p>${LANG === 'bn' ? '৬৪টি জেলা এবং ৪৯৯+ উপজেলা ভ্রমণ করুন, প্রোগ্রেস ট্র্যাক করুন এবং স্মৃতি সংরক্ষণ করুন।' : 'Visit 64 districts and 499+ upazilas, track your progress and save memories.'}</p>
      <p style="font-size:12px;line-height:2;margin-top:16px;">
        ${LANG === 'bn' ? '✓ সব জেলার ইতিহাস ও দর্শনীয় স্থান<br>✓ ঋতু অনুযায়ী ভ্রমণ গাইড<br>✓ উপজেলা স্তরে প্রোগ্রেস ট্রাকিং<br>✓ ভ্রমণ খরচ হিসাব<br>✓ ছবি ও ভিডিও শেয়ারিং' : '✓ History & attractions for all districts<br>✓ Seasonal travel guides<br>✓ Upazila-level progress tracking<br>✓ Travel cost tracking<br>✓ Photo & video sharing'}
      </p>
    </div>
  `;
}

function switchToLogin() {
  document.getElementById('authContainer').innerHTML = `
    <div class="login-card">
      <div class="flag-big"></div>
      <h1>${t('login')}</h1>
      <p>${LANG === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Login to your account'}</p>
      <input id="loginEmail" type="email" placeholder="${t('email')}">
      <input id="loginPassword" type="password" placeholder="${t('password')}">
      <button onclick="doLogin()">${t('login')}</button>
      <div class="login-divider">${LANG === 'bn' ? 'অথবা' : 'OR'}</div>
      <button onclick="switchToSignup()" style="background:var(--gold);color:#241a04;">${LANG === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create new account'}</button>
    </div>
    <div class="login-card" style="background:linear-gradient(135deg,var(--green-soft),#f0f8f5);">
      <h3 style="color:var(--green-deep);margin-top:0;">${LANG === 'bn' ? 'স্বাগতম!' : 'Welcome!'}</h3>
      <p>${LANG === 'bn' ? 'সম্পূর্ণ বাংলাদেশ ৬৪টি জেলা ঘুরে দেখুন, ভ্রমণ প্রোগ্রেস ট্র্যাক করুন এবং আপনার অভিজ্ঞতা শেয়ার করুন।' : 'Explore all 64 districts of Bangladesh, track your progress and share experiences.'}</p>
      <p style="font-size:12px;line-height:2;margin-top:16px;">
        ${LANG === 'bn' ? '✓ সব জেলার ইতিহাস ও দর্শনীয় স্থান<br>✓ যাতায়াত ব্যবস্থা ও বিখ্যাত খাবার<br>✓ ভ্রমণ প্রোগ্রেস ট্র্যাকিং<br>✓ ছবি ও ভিডিও শেয়ারিং' : '✓ History & attractions<br>✓ Transportation & famous food<br>✓ Travel progress tracking<br>✓ Photo & video sharing'}
      </p>
    </div>
  `;
}

async function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!name || !email || !phone || !password) {
    toast(LANG === 'bn' ? 'সব তথ্য পূরণ করুন' : 'Fill all information');
    return;
  }

  const users = await sget('users') || {};
  if (users[email]) {
    toast(LANG === 'bn' ? 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে' : 'Account already exists with this email');
    return;
  }

  users[email] = {
    name, email, phone,
    password: btoa(password),
    visitedDistricts: {},
    visitedUpazilas: {},
    notes: {},
    totalCost: 0,
    createdAt: new Date().toISOString()
  };

  await sset('users', users);
  CURRENT_USER = email;
  await sset('currentUser', email);
  IS_ADMIN = false;
  toast(LANG === 'bn' ? 'অ্যাকাউন্ট তৈরি সফল!' : 'Account created successfully!');
  showApp();
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    toast(LANG === 'bn' ? 'ইমেইল এবং পাসওয়ার্ড দিন' : 'Enter email and password');
    return;
  }

  const users = await sget('users') || {};
  const user = users[email];

  if (!user || user.password !== btoa(password)) {
    toast(LANG === 'bn' ? 'ইমেইল বা পাসওয়ার্ড ভুল' : 'Invalid email or password');
    return;
  }

  CURRENT_USER = email;
  await sset('currentUser', email);
  IS_ADMIN = false;
  showApp();
}

async function doLogout() {
  CURRENT_USER = null;
  IS_ADMIN = false;
  await sdel('currentUser');
  document.getElementById('appRoot').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  switchToLogin();
}

async function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appRoot').style.display = 'block';
  const users = await sget('users') || {};
  const user = users[CURRENT_USER];
  document.getElementById('userNameChip').textContent = user.name || 'User';
  navigate('home');
}

// ============ ADMIN ============
async function toggleAdminMode() {
  const pin = prompt(LANG === 'bn' ? 'প্রবেশ করুন (PIN: 1971)' : 'Enter PIN (1971)');
  if (!pin) return;
  if (pin === '1971') {
    IS_ADMIN = true;
    document.getElementById('adminBadge').style.display = 'inline-block';
    toast(LANG === 'bn' ? 'অ্যাডমিন মোড সক্রিয়' : 'Admin mode enabled');
    render();
  } else {
    toast(LANG === 'bn' ? 'ভুল পিন' : 'Wrong PIN');
  }
}

// ============ USER DATA ============
async function getUserData() {
  const users = await sget('users') || {};
  return users[CURRENT_USER] || {};
}

async function saveUserData(data) {
  const users = await sget('users') || {};
  users[CURRENT_USER] = { ...users[CURRENT_USER], ...data };
  await sset('users', users);
}

async function toggleVisitDistrict(districtId) {
  const user = await getUserData();
  if (!user.visitedDistricts) user.visitedDistricts = {};
  if (user.visitedDistricts[districtId]) {
    delete user.visitedDistricts[districtId];
  } else {
    user.visitedDistricts[districtId] = new Date().toISOString().split('T')[0];
  }
  await saveUserData(user);
  render();
}

async function toggleVisitUpazila(districtId, upazilaName) {
  const user = await getUserData();
  if (!user.visitedUpazilas) user.visitedUpazilas = {};
  const key = `${districtId}-${upazilaName}`;
  if (user.visitedUpazilas[key]) {
    delete user.visitedUpazilas[key];
  } else {
    user.visitedUpazilas[key] = new Date().toISOString().split('T')[0];
  }
  await saveUserData(user);
  render();
}

async function addNoteToUpazila(districtId, upazilaName, note, cost) {
  const user = await getUserData();
  if (!user.notes) user.notes = {};
  const key = `${districtId}-${upazilaName}`;
  user.notes[key] = {
    note, cost: parseInt(cost) || 0,
    date: new Date().toISOString().split('T')[0]
  };
  user.totalCost = (user.totalCost || 0) + (parseInt(cost) || 0);
  await saveUserData(user);
  render();
}

// ============ NAVIGATION ============
function navigate(page, districtId) {
  ROUTE = { page, districtId: districtId || null };
  document.querySelectorAll('.topnav button').forEach(b => b.classList.remove('active'));
  const map = { home: 'nav-home', explore: 'nav-explore', progress: 'nav-progress', seasons: 'nav-seasons', itinerary: 'nav-itinerary', trainmap: 'nav-trainmap', services: 'nav-services' };
  if (map[page]) document.getElementById(map[page])?.classList.add('active');
  window.scrollTo(0, 0);
  render();
}

function findDistrict(id) {
  for (const div of BD_DATA) {
    for (const d of div.districts) {
      if (d.id === id) return { d, division: div.division };
    }
  }
  return null;
}

function esc(s) {
  return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============ RENDERING ============
async function render() {
  const root = document.getElementById('pageRoot');
  const user = await getUserData();

  if (ROUTE.page === 'home') root.innerHTML = await renderHome(user);
  else if (ROUTE.page === 'explore') root.innerHTML = await renderExplore(user);
  else if (ROUTE.page === 'progress') root.innerHTML = await renderProgress(user);
  else if (ROUTE.page === 'district') root.innerHTML = await renderDistrict(ROUTE.districtId, user);
  else if (ROUTE.page === 'seasons') root.innerHTML = renderSeasons();
  else if (ROUTE.page === 'itinerary') root.innerHTML = renderItinerary();
  else if (ROUTE.page === 'trainmap') root.innerHTML = renderTrainMap();
  else if (ROUTE.page === 'services') root.innerHTML = renderServices();
}

// ============ HOME ============
async function renderHome(user) {
  const totalDistricts = BD_DATA.reduce((a, d) => a + d.districts.length, 0);
  const visitedCount = Object.keys(user.visitedDistricts || {}).length;
  const pct = Math.round((visitedCount / totalDistricts) * 100);
  const totalUpazilas = BD_DATA.reduce((a, d) => a + d.districts.reduce((b, ud) => b + ud.upazilas.length, 0), 0);
  const visitedUpazilas = Object.keys(user.visitedUpazilas || {}).length;

  const heroTitle = LANG === 'bn' ? 'সম্পূর্ণ বাংলাদেশ ভ্রমণ পরিকল্পনা' : 'Complete Bangladesh Travel Guide';
  const heroDesc = LANG === 'bn' ? 'ইতিহাস, ঐতিহ্য, খাবার, দর্শনীয় স্থান এবং প্রতিটি উপজেলার সাথে সম্পূর্ণ বাংলাদেশ ঘুরে দেখুন। আপনার প্রোগ্রেস ট্র্যাক করুন এবং অভিজ্ঞতা শেয়ার করুন।' : 'Explore all of Bangladesh with history, heritage, food, attractions and every upazila. Track your progress and share experiences.';

  let html = `
    <div class="hero">
      <h1>${heroTitle}</h1>
      <p>${heroDesc}</p>
      <div class="stats">
        <div class="stat"><b>${visitedCount}</b><span>${LANG === 'bn' ? 'জেলা' : 'Districts'}</span></div>
        <div class="stat"><b>${visitedUpazilas}</b><span>${LANG === 'bn' ? 'উপজেলা' : 'Upazilas'}</span></div>
        <div class="stat"><b>৬৪</b><span>${LANG === 'bn' ? 'মোট' : 'Total'}</span></div>
        <div class="stat"><b>${pct}%</b><span>${LANG === 'bn' ? 'অগ্রগতি' : 'Progress'}</span></div>
      </div>
    </div>

    <div class="portfolio">
      <h2>${LANG === 'bn' ? '🌍 বাংলাদেশের বৈচিত্র্য' : '🌍 Bangladesh Diversity'}</h2>
      <div class="portfolio-grid">
        <div class="portfolio-item">
          <div class="icon">🏛️</div>
          <h3>${LANG === 'bn' ? 'ঐতিহ্য' : 'Heritage'}</h3>
          <p>${LANG === 'bn' ? 'ইউনেস্কো বিশ্ব ঐতিহ্য, প্রাচীন মন্দির এবং মসজিদ' : 'UNESCO world heritage, ancient temples and mosques'}</p>
        </div>
        <div class="portfolio-item">
          <div class="icon">🏔️</div>
          <h3>${LANG === 'bn' ? 'প্রকৃতি' : 'Nature'}</h3>
          <p>${LANG === 'bn' ? 'পাহাড়, সুন্দরবন, সমুদ্র সৈকত এবং হাওর' : 'Hills, Sundarbans, beaches and haors'}</p>
        </div>
        <div class="portfolio-item">
          <div class="icon">🍛</div>
          <h3>${LANG === 'bn' ? 'খাবার' : 'Food'}</h3>
          <p>${LANG === 'bn' ? 'আঞ্চলিক রন্ধনশৈলী এবং ঐতিহ্যবাহী খাবার' : 'Regional cuisine and traditional food'}</p>
        </div>
        <div class="portfolio-item">
          <div class="icon">🎭</div>
          <h3>${LANG === 'bn' ? 'সংস্কৃতি' : 'Culture'}</h3>
          <p>${LANG === 'bn' ? 'উৎসব, লোকশিল্প এবং ঐতিহ্যবাহী সঙ্গীত' : 'Festivals, folk art and traditional music'}</p>
        </div>
        <div class="portfolio-item">
          <div class="icon">🚂</div>
          <h3>${LANG === 'bn' ? 'যাতায়াত' : 'Transport'}</h3>
          <p>${LANG === 'bn' ? 'সাশ্রয়ী ট্রেন, বাস এবং লঞ্চ সেবা' : 'Affordable trains, buses and ferry services'}</p>
        </div>
        <div class="portfolio-item">
          <div class="icon">📸</div>
          <h3>${LANG === 'bn' ? 'স্মৃতি' : 'Memories'}</h3>
          <p>${LANG === 'bn' ? 'ছবি, ভিডিও এবং নোট শেয়ার করুন' : 'Share photos, videos and notes'}</p>
        </div>
      </div>
    </div>

    <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div>

    <div class="section-title"><h2>${LANG === 'bn' ? 'এই মৌসুমে ভ্রমণ করুন' : 'Travel This Season'}</h2></div>
    ${renderSeasonSuggestions(user)}
  `;
  return html;
}

function renderSeasonSuggestions(user) {
  const currentMonth = new Date().getMonth() + 1;
  let currentSeason = SEASONS[4]; // Default to winter
  
  if (currentMonth >= 4 && currentMonth <= 6) currentSeason = SEASONS[0];
  else if (currentMonth >= 7 && currentMonth <= 9) currentSeason = SEASONS[1];
  else if (currentMonth === 10 || currentMonth === 11) currentSeason = SEASONS[2];
  else if ((currentMonth === 12 || currentMonth === 1)) currentSeason = SEASONS[3];
  else if ((currentMonth === 1 || currentMonth === 2 || currentMonth === 3)) currentSeason = SEASONS[5];

  return `
    <div class="season-card" style="grid-column:1/-1;background:linear-gradient(135deg, var(--green-soft), #f0f8f5);border-top:5px solid var(--gold);">
      <h3>${currentSeason.name}</h3>
      <div class="months">${currentSeason.months}</div>
      <p>${currentSeason.desc}</p>
      <ul>${currentSeason.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="dtags">
        ${currentSeason.districts.map(d => `<span onclick="goToDistrictByName('${esc(d)}')" style="cursor:pointer;">${esc(d)} →</span>`).join('')}
      </div>
    </div>
  `;
}

function goToDistrictByName(name) {
  for (const div of BD_DATA) {
    for (const d of div.districts) {
      if (d.name === name) {
        navigate('district', d.id);
        return;
      }
    }
  }
}

// ============ EXPLORE ============
async function renderExplore(user) {
  const exploreTitle = LANG === 'bn' ? 'সব বিভাগ ও জেলা' : 'All Divisions & Districts';
  const searchPlaceholder = LANG === 'bn' ? 'জেলা বা উপজেলা খুঁজুন...' : 'Search district or upazila...';
  
  let html = `
    <div class="section-title"><h2>${exploreTitle}</h2></div>
    <div class="search-box"><input id="searchInput" placeholder="${searchPlaceholder}" oninput="filterSearch(this.value)"></div>
    <div id="exploreList">
  `;

  for (const div of BD_DATA) {
    const dvisited = div.districts.filter(d => user.visitedDistricts && user.visitedDistricts[d.id]).length;
    html += `
      <div class="division-block" data-div="${esc(div.division)}">
        <div class="division-header" onclick="toggleDivision(this)">
          <span class="chev">▾</span><h3>${esc(div.division)}</h3>
          <span class="prog">${dvisited}/${div.districts.length}</span>
        </div>
        <div class="grid">
          ${div.districts.map(d => `
            <div class="dcard" data-name="${esc(d.name)}" onclick="navigate('district', ${d.id})">
              ${user.visitedDistricts && user.visitedDistricts[d.id] ? '<div class="visited-tag">✓</div>' : ''}
              <h4>${esc(d.name)}</h4>
              <div class="sub">${d.upazilas.length}${LANG === 'bn' ? 'টি উপজেলা' : ' upazilas'}</div>
              <div class="famous">${esc(d.famous)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

function filterSearch(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.dcard[data-name]').forEach(card => {
    const hay = card.dataset.name.toLowerCase();
    card.style.display = hay.includes(q) ? '' : 'none';
  });
}

function toggleDivision(el) {
  el.classList.toggle('collapsed');
  const grid = el.nextElementSibling;
  grid.style.display = el.classList.contains('collapsed') ? 'none' : 'grid';
}

// ============ DISTRICT ============
async function renderDistrict(id, user) {
  const found = findDistrict(id);
  if (!found) return '<p>জেলা খুঁজে পাওয়া যায়নি</p>';

  const { d, division } = found;
  const done = user.visitedDistricts && user.visitedDistricts[id];

  let html = `
    <button class="backbtn" onclick="navigate('explore')">← ${LANG === 'bn' ? 'ফিরুন' : 'Back'}</button>
    <div class="dhead">
      <div class="breadcrumb">${esc(division)}</div>
      <div class="dhead-top">
        <div>
          <h1>${esc(d.name)} ${LANG === 'bn' ? 'জেলা' : 'District'}</h1>
          <div class="famous">${esc(d.famous)}</div>
        </div>
        <button class="visit-btn ${done ? 'done' : ''}" onclick="toggleVisitDistrictUI(${id})">${done ? '✓ ' + (LANG === 'bn' ? 'ভ্রমণ সম্পন্ন' : 'Visited') : (LANG === 'bn' ? 'ভ্রমণ সম্পন্ন' : 'Mark Visited')}</button>
      </div>
      <div class="history">${esc(d.history)}</div>
    </div>

    <div class="card-grid">
      <div class="panel"><h3>🍽️ ${LANG === 'bn' ? 'বিখ্যাত খাবার' : 'Famous Food'}</h3>${d.food && d.food.length ? `<ul>${d.food.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : '<div class="empty">' + (LANG === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') + '</div>'}</div>
      <div class="panel"><h3>📍 ${LANG === 'bn' ? 'দর্শনীয় স্থান' : 'Attractions'}</h3>${d.attractions && d.attractions.length ? `<ul>${d.attractions.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : '<div class="empty">' + (LANG === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') + '</div>'}</div>
      <div class="panel"><h3>🎯 ${LANG === 'bn' ? 'করণীয় কার্যক্রম' : 'Activities'}</h3>${d.activities && d.activities.length ? `<ul>${d.activities.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : '<div class="empty">' + (LANG === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') + '</div>'}</div>

      <div class="panel">
        <h3>🚌 ${LANG === 'bn' ? 'যাতায়াত ব্যবস্থা' : 'Transportation'}</h3>
        <div class="transport-row"><span class="ic">🚌</span><div><b>${LANG === 'bn' ? 'বাস' : 'Bus'}:</b> ${esc(d.transport?.bus || (LANG === 'bn' ? 'তথ্য নেই' : 'Not available'))}</div></div>
        <div class="transport-row"><span class="ic">🚆</span><div><b>${LANG === 'bn' ? 'ট্রেন' : 'Train'}:</b> ${esc(d.transport?.train || (LANG === 'bn' ? 'নেই' : 'N/A'))}</div></div>
        <div class="transport-row"><span class="ic">✈️</span><div><b>${LANG === 'bn' ? 'বিমান' : 'Air'}:</b> ${esc(d.transport?.air || (LANG === 'bn' ? 'নেই' : 'N/A'))}</div></div>
        <div class="transport-row"><span class="ic">🚢</span><div><b>${LANG === 'bn' ? 'লঞ্চ' : 'Ferry'}:</b> ${esc(d.transport?.launch || (LANG === 'bn' ? 'নেই' : 'N/A'))}</div></div>
      </div>

      <div class="panel upazila-panel">
        <h3>🗺️ ${esc(d.name)} - ${LANG === 'bn' ? 'উপজেলাসমূহ' : 'Upazilas'}</h3>
        <div class="upazila-list">
          ${d.upazilas.map(u => {
            const visited = user.visitedUpazilas && user.visitedUpazilas[`${id}-${u}`];
            const safeName = u.replace(/\s+/g, '_');
            return `
              <div class="upazila-detail">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h4 style="margin:0;flex:1;">${esc(u)}</h4>
                  <button class="visit-btn" style="padding:6px 12px;font-size:12px;" onclick="toggleVisitUpazilaUI(${id}, '${esc(u)}')">${visited ? '✓ ' + (LANG === 'bn' ? 'গেছি' : 'Visited') : (LANG === 'bn' ? 'গেছি' : 'Mark')}</button>
                </div>
                ${visited ? `
                  <div style="margin-top:10px;background:var(--green-soft);padding:10px;border-radius:8px;">
                    <textarea id="noteText_${id}_${safeName}" placeholder="${LANG === 'bn' ? 'নোট লিখুন...' : 'Add note...'}" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;font-family:inherit;font-size:13px;min-height:60px;">${user.notes && user.notes[`${id}-${u}`] ? esc(user.notes[`${id}-${u}`].note) : ''}</textarea>
                    <input type="number" id="noteCost_${id}_${safeName}" placeholder="${LANG === 'bn' ? 'খরচ (টাকা)' : 'Cost (Taka)'}" value="${user.notes && user.notes[`${id}-${u}`] ? user.notes[`${id}-${u}`].cost : ''}" style="width:100%;margin-top:6px;padding:8px;border:1px solid var(--line);border-radius:6px;font-family:inherit;">
                    <button onclick="saveUpazilaNote(${id}, '${esc(u)}')" style="background:var(--green);color:#fff;padding:6px 12px;border:none;border-radius:6px;margin-top:6px;cursor:pointer;font-weight:600;font-size:12px;width:100%;">${LANG === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}</button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    ${IS_ADMIN ? renderAdminPanel(id, d) : ''}
  `;
  return html;
}

function renderAdminPanel(districtId, district) {
  return `
    <div class="admin-box" style="margin-top:20px;background:#fff7ee;border:2px dashed var(--red);">
      <h3 style="margin:0 0 12px;color:var(--red);">📝 ${LANG === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'} - ${district.name}</h3>
      
      <div style="display:grid;gap:12px;">
        <div>
          <label>${LANG === 'bn' ? 'স্থানের তথ্য আপডেট করুন:' : 'Update Place Info:'}</label>
          <textarea id="adminHistory" placeholder="${LANG === 'bn' ? 'ইতিহাস ও বিবরণ' : 'History & Description'}" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;margin-top:6px;font-family:inherit;font-size:13px;min-height:100px;">${district.history || ''}</textarea>
        </div>
        <div>
          <label>${LANG === 'bn' ? 'টিকিটের মূল্য:' : 'Ticket Price:'}</label>
          <input type="number" id="adminTicketPrice" placeholder="${LANG === 'bn' ? 'টাকা' : 'Taka'}" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;margin-top:6px;font-family:inherit;">
        </div>
        <div>
          <button onclick="saveAdminChanges(${districtId})" style="background:var(--green);color:#fff;padding:12px;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:14px;width:100%;">${LANG === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  `;
}

async function toggleVisitDistrictUI(id) {
  await toggleVisitDistrict(id);
}

async function toggleVisitUpazilaUI(districtId, upazilaName) {
  await toggleVisitUpazila(districtId, upazilaName);
}

async function saveUpazilaNote(districtId, upazilaName) {
  const safeName = upazilaName.replace(/\s+/g, '_');
  const note = document.getElementById(`noteText_${districtId}_${safeName}`).value.trim();
  const cost = document.getElementById(`noteCost_${districtId}_${safeName}`).value.trim();
  
  if (!note && !cost) {
    toast(LANG === 'bn' ? 'কিছু তথ্য লিখুন' : 'Enter some information');
    return;
  }
  
  await addNoteToUpazila(districtId, upazilaName, note, cost);
  toast(LANG === 'bn' ? 'নোট সংরক্ষিত হয়েছে' : 'Note saved');
}

async function saveAdminChanges(districtId) {
  const found = findDistrict(districtId);
  if (!found) return;

  const { d } = found;
  const history = document.getElementById('adminHistory').value.trim();
  const ticketPrice = document.getElementById('adminTicketPrice').value.trim();

  if (history) d.history = history;
  if (ticketPrice) d.ticketPrice = ticketPrice;

  await sset(`admin:district:${districtId}`, { ticketPrice });
  toast(LANG === 'bn' ? 'পরিবর্তন সংরক্ষিত হয়েছে' : 'Changes saved');
}

// ============ PROGRESS ============
async function renderProgress(user) {
  const totalDistricts = BD_DATA.reduce((a, d) => a + d.districts.length, 0);
  const visitedCount = Object.keys(user.visitedDistricts || {}).length;
  const pct = Math.round((visitedCount / totalDistricts) * 100);
  const totalCost = user.totalCost || 0;

  const progressTitle = LANG === 'bn' ? 'আমার ভ্রমণ প্রোগ্রেস' : 'My Travel Progress';

  let html = `
    <div class="section-title"><h2>${progressTitle}</h2></div>
    <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;">
      <div style="background:var(--green-soft);padding:16px;border-radius:12px;text-align:center;">
        <div style="font-size:24px;font-weight:700;color:var(--green-deep);">${visitedCount}/${totalDistricts}</div>
        <div style="font-size:12px;color:var(--ink-soft);">${LANG === 'bn' ? 'জেলা ভ্রমণকৃত' : 'Districts Visited'}</div>
      </div>
      <div style="background:var(--green-soft);padding:16px;border-radius:12px;text-align:center;">
        <div style="font-size:24px;font-weight:700;color:var(--green-deep);">${pct}%</div>
        <div style="font-size:12px;color:var(--ink-soft);">${LANG === 'bn' ? 'অগ্রগতি' : 'Progress'}</div>
      </div>
      <div style="background:var(--green-soft);padding:16px;border-radius:12px;text-align:center;">
        <div style="font-size:24px;font-weight:700;color:var(--green-deep);">৳${totalCost}</div>
        <div style="font-size:12px;color:var(--ink-soft);">${LANG === 'bn' ? 'মোট খরচ' : 'Total Cost'}</div>
      </div>
    </div>
  `;

  html += `<div class="progress-list">`;
  for (const div of BD_DATA) {
    for (const d of div.districts) {
      const done = user.visitedDistricts && user.visitedDistricts[d.id];
      const upazilas = d.upazilas || [];
      const visitedUpzCount = upazilas.filter(u => user.visitedUpazilas && user.visitedUpazilas[`${d.id}-${u}`]).length;

      html += `
        <div class="progress-row ${done ? 'done' : ''}" onclick="navigate('district', ${d.id})" style="cursor:pointer;">
          <span class="chk"></span>
          <span class="dn">
            ${esc(d.name)} ${LANG === 'bn' ? 'জেলা' : 'District'}
            <span class="divname">— ${esc(div.division)}</span>
            ${visitedUpzCount > 0 ? `<span class="upz-count">${visitedUpzCount}/${upazilas.length}</span>` : ''}
          </span>
        </div>
      `;
    }
  }
  html += `</div>`;
  return html;
}

// ============ SEASONS ============
function renderSeasons() {
  const seasonsTitle = LANG === 'bn' ? 'বাংলাদেশের ৬ ঋতু' : '6 Seasons of Bangladesh';
  let html = `<div class="section-title"><h2>${seasonsTitle}</h2></div>
    <div class="season-grid">`;
  for (const s of SEASONS) {
    html += `
      <div class="season-card ${s.key}">
        <h3>${s.name}</h3>
        <div class="months">${s.months}</div>
        <p>${s.desc}</p>
        <ul>${s.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      </div>
    `;
  }
  html += `</div>`;
  return html;
}

// ============ ITINERARY ============
let ACTIVE_ITIN = 7;
function renderItinerary() {
  const itinTitle = LANG === 'bn' ? 'ভ্রমণ পরিকল্পনা' : 'Travel Itineraries';
  const it = ITINERARIES.find(x => x.days === ACTIVE_ITIN) || ITINERARIES[0];
  let html = `
    <div class="section-title"><h2>${itinTitle}</h2></div>
    <div class="itin-tabs">
      ${ITINERARIES.map(x => `<button class="${x.days === ACTIVE_ITIN ? 'active' : ''}" onclick="setItin(${x.days})">${x.days} ${LANG === 'bn' ? 'দিন' : 'days'}</button>`).join('')}
    </div>
    <div class="itin-panel">
      <h3>${esc(it.title)}</h3>
      <div class="sub">${esc(it.subtitle)}</div>
      <ul class="itin-steps">
        ${it.route.map((r, i) => `<li><span class="num">${i + 1}</span><span class="txt">${esc(r)}</span></li>`).join('')}
      </ul>
    </div>
  `;
  return html;
}

function setItin(days) {
  ACTIVE_ITIN = days;
  document.getElementById('pageRoot').innerHTML = renderItinerary();
}

// ============ TRAIN MAP ============
function renderTrainMap() {
  const trainTitle = LANG === 'bn' ? 'বাংলাদেশ ট্রেন ম্যাপ' : 'Bangladesh Train Map';
  const trainDesc = LANG === 'bn' ? 'সব রেলওয়ে স্টেশন এবং রুট এর জন্য:' : 'For all railway stations and routes:';
  const trainTip = LANG === 'bn' ? 'বাংলাদেশ রেলওয়ের ই-টিকিট পোর্টাল থেকে সরাসরি অনলাইনে টিকিট কাটতে পারেন।' : 'Book tickets online directly from Bangladesh Railway e-ticket portal.';
  
  return `
    <div class="section-title"><h2>${trainTitle}</h2></div>
    <div class="tm-card">
      <p>${trainDesc}</p>
      <div style="background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:20px;text-align:center;">
        <p style="margin:0 0 12px;color:var(--ink-soft);">RailsMaps.com</p>
        <a class="tm-linkbtn" href="https://railsmaps.com/bangladesh/stations" target="_blank" rel="noopener">🗺️ ${LANG === 'bn' ? 'ম্যাপ দেখুন' : 'View Map'}</a>
      </div>
      <div style="margin-top:16px;background:var(--green-soft);padding:16px;border-radius:10px;font-size:13px;color:var(--ink-soft);">
        <strong>💡 ${LANG === 'bn' ? 'টিপস' : 'Tips'}:</strong> <a href="https://eticket.railway.gov.bd" target="_blank" style="color:var(--green);text-decoration:none;">${LANG === 'bn' ? 'ই-টিকিট পোর্টাল' : 'E-ticket Portal'}</a> ${trainTip}
      </div>
    </div>
  `;
}

// ============ SERVICES ============
function renderServices() {
  const servicesTitle = LANG === 'bn' ? 'সেবাসমূহ' : 'Services';
  let html = `<div class="section-title"><h2>${servicesTitle}</h2></div><div class="card-grid">`;
  for (const [key, s] of Object.entries(SERVICES)) {
    html += `
      <div class="service-card">
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        ${s.links ? `<div class="service-links">${s.links.map(l => `<a href="${esc(l.url)}" target="_blank">${esc(l.name)} ↗</a>`).join('')}</div>` : ''}
      </div>
    `;
  }
  html += `</div>`;
  return html;
}

// ============ INITIALIZATION ============
window.addEventListener('DOMContentLoaded', async () => {
  LANG = localStorage.getItem('lang') || 'bn';
  const currentUser = localStorage.getItem('currentUser');
  
  if (currentUser) {
    CURRENT_USER = currentUser;
    showApp();
  } else {
    switchToLogin();
  }

  // Language toggle - Ctrl+L or Alt+L
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.altKey) && e.key === 'l') {
      e.preventDefault();
      toggleLanguage();
    }
  });
});
