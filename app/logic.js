/* Spese — logica pura, testabile in isolamento. */
(function (root) {
  'use strict';
const T=root.TwoFiftiesI18n||{t:x=>x,fragment:x=>x,locale:"it-IT"};

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function round2(n) { return Math.round(Number(n) * 100) / 100; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fmtDateShort(iso) {
    if (!iso) return '';
    const p = iso.split('-').map(Number);
    if (p.length !== 3 || !p[0]) return iso;
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(T.locale, { day: 'numeric', month: 'short' });
  }
  function fmtDateLong(iso) {
    if (!iso) return '';
    const p = iso.split('-').map(Number);
    if (p.length !== 3 || !p[0]) return iso;
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(T.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function groupLabel(iso) {
    const today = todayISO();
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yest = isoDate(y);
    if (iso === today) return T.fragment('Oggi');
    if (iso === yest) return T.fragment('Ieri');
    const p = iso.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    const s = d.toLocaleDateString(T.locale, { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function monthLabel(year, month) {
    const s = new Date(year, month, 1).toLocaleDateString(T.locale, { month: 'long', year: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function monthRange(year, month) {
    return { from: isoDate(new Date(year, month, 1)), to: isoDate(new Date(year, month + 1, 0)) };
  }

  function fmtEur(n) {
 if(T.locale==="en-GB")return new Intl.NumberFormat(T.locale,{style:"currency",currency:"EUR"}).format(n);
    const parts = Math.abs(n).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (n < 0 ? '-' : '') + '€ ' + parts.join(',');
  }
  function humanSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }

  const DEFAULT_CATEGORIES = [
    { id: 'cibo',      name: 'Cibo',      icon: '🍽️', color: '#B3261E' },
    { id: 'casa',      name: 'Casa',      icon: '🏠', color: '#6750A4' },
    { id: 'trasporti', name: 'Trasporti', icon: '🚗', color: '#146C2E' },
    { id: 'svago',     name: 'Svago',     icon: '🎉', color: '#7D5260' },
    { id: 'salute',    name: 'Salute',    icon: '💊', color: '#0061A4' },
    { id: 'regali',    name: 'Regali',    icon: '🎁', color: '#9A4600' },
    { id: 'altro',     name: 'Altro',     icon: '📦', color: '#49454F' }
  ];

  /* #79747E = outline chiaro: come testo non regge il contrasto (3:1). Neutro M3 usato al suo posto. */
  const NEUTRAL_COLOR = '#49454F';

  function normalizeCategory(c) {
    if (!c || typeof c !== 'object') return null;
    const id = String(c.id || '').trim().slice(0, 40);
    const name = String(c.name || '').trim().slice(0, 40);
    if (!id || !name) return null;
    let color = String(c.color || '');
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) color = NEUTRAL_COLOR;
    else if (/^#79747E$/i.test(color)) color = NEUTRAL_COLOR;
    return { id, name,
      icon: String(c.icon || '📦').slice(0, 8),
      color
    };
  }
  function normalizeCategories(arr) {
    if (!Array.isArray(arr)) return DEFAULT_CATEGORIES.slice();
    const out = arr.map(normalizeCategory).filter(Boolean);
    return out.length ? out : DEFAULT_CATEGORIES.slice();
  }
  function getCategory(categories, id) {
    if (!Array.isArray(categories)) return null;
    return categories.find(function (c) { return c.id === id; }) || null;
  }
  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'cat-' + Math.random().toString(36).slice(2, 6);
  }

  function normalizeEntry(e, defaultCategoryId) {
    if (!e || typeof e !== 'object') return null;
    const type = e.type === 'settle' ? 'settle' : 'expense';
    const amount = Number(e.amount);
    if (!isFinite(amount) || amount <= 0) return null;
    const out = {
      id: String(e.id || uid()),
      type,
      date: String(e.date || todayISO()),
      desc: String(e.desc || (type === 'settle' ? T.fragment('Saldo') : '')),
      amount: round2(amount),
      created: Number(e.created) || Date.now()
    };
    if (e.note) out.note = String(e.note).slice(0, 300);
    if (e.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(e.dueDate)) out.dueDate = e.dueDate;
    if (Array.isArray(e.reimbursedEntryIds)) out.reimbursedEntryIds = e.reimbursedEntryIds.map(String);
    if (e.reimbursementFor) out.reimbursementFor = String(e.reimbursementFor);
    if (e.reimbursedAt) out.reimbursedAt = Number(e.reimbursedAt) || null;
    if (Array.isArray(e.receipts)) out.receipts = e.receipts.filter(r => r && /^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(r.id)).map(r => ({id:r.id,name:String(r.name||T.fragment('Ricevuta')).slice(0,120),size:Number(r.size)||0}));
    if (e.recurrenceId) {
      out.recurrenceId = String(e.recurrenceId);
      out.recurrenceDate = String(e.recurrenceDate || e.date);
    }
    if (type === 'settle') {
      out.from = (e.from === 'person-a' || e.from === 'person-b') ? e.from : 'person-a';
      out.to = out.from === 'person-a' ? 'person-b' : 'person-a';
    } else {
      out.payer = (e.payer === 'person-a' || e.payer === 'person-b') ? e.payer : 'person-a';
      out.categoryId = String(e.categoryId || defaultCategoryId || 'altro');
      const sJ = Number(e.shareJ), sG = Number(e.shareG);
      if (isFinite(sJ) && isFinite(sG) && Math.abs(sJ + sG - out.amount) < 0.02) {
        out.shareJ = round2(sJ); out.shareG = round2(sG);
      } else {
        out.shareJ = round2(out.amount / 2); out.shareG = round2(out.amount - out.shareJ);
      }
    }
    return out;
  }

  function normalizeRecurrence(r, defaultCategoryId) {
    if (!r || typeof r !== 'object') return null;
    const amount = Number(r.amount);
    if (!isFinite(amount) || amount <= 0) return null;
    const day = Math.max(1, Math.min(31, parseInt(r.dayOfMonth, 10) || 1));
    const out = {
      id: String(r.id || uid()),
      desc: String(r.desc || T.fragment('Ricorrente')).slice(0, 120),
      amount: round2(amount),
      payer: (r.payer === 'person-b') ? 'person-b' : 'person-a',
      categoryId: String(r.categoryId || defaultCategoryId || 'altro'),
      dayOfMonth: day,
      active: r.active !== false,
      requiresConfirmation: r.requiresConfirmation === true,
      startDate: String(r.startDate || todayISO()),
      lastGeneratedDate: r.lastGeneratedDate ? String(r.lastGeneratedDate) : null,
      created: Number(r.created) || Date.now()
    };
    if (r.note) out.note = String(r.note).slice(0, 300);
    const sJ = Number(r.shareJ), sG = Number(r.shareG);
    if (isFinite(sJ) && isFinite(sG) && Math.abs(sJ + sG - out.amount) < 0.02) {
      out.shareJ = round2(sJ); out.shareG = round2(sG);
    } else {
      out.shareJ = round2(out.amount / 2); out.shareG = round2(out.amount - out.shareJ);
    }
    return out;
  }

  function computeTotals(list) {
    const src = Array.isArray(list) ? list : [];
    let paidJ = 0, paidG = 0, owedJ = 0, owedG = 0, setGtoJ = 0, setJtoG = 0;
    for (const e of src) {
      const amt = Number(e.amount) || 0;
      if (e.type === 'settle') {
        if (e.from === 'person-b') setGtoJ += amt; else setJtoG += amt;
      } else {
        if (e.payer === 'person-a') paidJ += amt; else paidG += amt;
        owedJ += (e.shareJ !== undefined ? Number(e.shareJ) : amt / 2);
        owedG += (e.shareG !== undefined ? Number(e.shareG) : amt / 2);
      }
    }
    const balance = paidJ - owedJ - setGtoJ + setJtoG;
    return { paidJ, paidG, owedJ, owedG, total: paidJ + paidG, balance };
  }

  function entryIsEqualSplit(e) {
    if (!e || e.type === 'settle') return true;
    const sJ = e.shareJ !== undefined ? Number(e.shareJ) : e.amount / 2;
    return Math.abs(sJ - e.amount / 2) < 0.02;
  }
  function entrySplitLabel(e) {
    if (entryIsEqualSplit(e)) return '';
    const pJ = Math.round((e.shareJ / e.amount) * 100);
    return pJ + '/' + (100 - pJ);
  }

  function sharesFromPercent(amount, percentJ) {
    const amt = round2(Number(amount) || 0);
    let pJ = Number(percentJ);
    if (!isFinite(pJ)) pJ = 50;
    pJ = Math.max(0, Math.min(100, pJ));
    const shareJ = round2(amt * pJ / 100);
    const shareG = round2(amt - shareJ);
    return { shareJ, shareG, percentJ: pJ, percentG: round2(100 - pJ) };
  }
  function percentFromShares(amount, shareJ) {
    const amt = Number(amount) || 0;
    if (amt <= 0) return { percentJ: 50, percentG: 50 };
    const pJ = Math.round((Number(shareJ) || 0) / amt * 100);
    return { percentJ: pJ, percentG: 100 - pJ };
  }

  function getDateRange(filters) {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth();
    if (filters.period === 'this_month') return monthRange(y, m);
    if (filters.period === 'last_month') return monthRange(y, m - 1);
    if (filters.period === 'last_7') { const f = new Date(now); f.setDate(f.getDate() - 6); return { from: isoDate(f), to: isoDate(now) }; }
    if (filters.period === 'last_30') { const f = new Date(now); f.setDate(f.getDate() - 29); return { from: isoDate(f), to: isoDate(now) }; }
    if (filters.period === 'custom') return { from: filters.from || null, to: filters.to || null };
    return { from: null, to: null };
  }
  function hasActiveFilters(filters) {
    return filters.period !== 'all' || filters.person !== 'all'
      || filters.categoryId !== 'all' || !!filters.search || (!!filters.advance && filters.advance !== 'all');
  }
  function applyFilters(arr, filters) {
    let out = Array.isArray(arr) ? arr.slice() : [];
    if (filters.person !== 'all') out = out.filter(function (e) { return e.type === 'expense' && e.payer === filters.person; });
    if (filters.categoryId && filters.categoryId !== 'all') out = out.filter(function (e) { return e.type === 'expense' && e.categoryId === filters.categoryId; });
    if (filters.search) {
      const q = filters.search.toLowerCase();
      out = out.filter(function (e) { return ((e.desc || '') + ' ' + (e.note || '')).toLowerCase().indexOf(q) !== -1; });
    }
    if (filters.advance && filters.advance !== 'all') out = out.filter(function(e){ return e.type === 'expense' && (filters.advance === 'person-a' ? e.payer === 'person-a' && e.shareJ === 0 : e.payer === 'person-b' && e.shareG === 0); });
    const r = getDateRange(filters);
    if (r.from) out = out.filter(function (e) { return (e.date || '') >= r.from; });
    if (r.to) out = out.filter(function (e) { return (e.date || '') <= r.to; });
    return out;
  }
  /* Filtra per intervallo di date (from/to inclusi). Estremi null = illimitati. */
  function filterByDateRange(arr, from, to) {
    let out = Array.isArray(arr) ? arr.slice() : [];
    if (from) out = out.filter(function (e) { return (e.date || '') >= from; });
    if (to) out = out.filter(function (e) { return (e.date || '') <= to; });
    return out;
  }
  function periodLabel(filters) {
    if (filters.period === 'this_month') return T.fragment('Questo mese');
    if (filters.period === 'last_month') return T.fragment('Mese scorso');
    if (filters.period === 'last_7') return T.fragment('Ultimi 7 giorni');
    if (filters.period === 'last_30') return T.fragment('Ultimi 30 giorni');
    if (filters.period === 'custom') {
      const r = getDateRange(filters);
      if (r.from && r.to) return fmtDateShort(r.from) + ' → ' + fmtDateShort(r.to);
      if (r.from) return T.fragment('Da ') + fmtDateShort(r.from);
      if (r.to) return T.fragment('Fino a ') + fmtDateShort(r.to);
    }
    return null;
  }

  function monthStats(entries, categories, year, month) {
    const r = monthRange(year, month);
    const list = (Array.isArray(entries) ? entries : []).filter(function (e) {
      return e.type === 'expense' && e.date >= r.from && e.date <= r.to;
    });
    const totals = computeTotals(list);
    const byCat = {};
    for (const e of list) {
      const cid = e.categoryId || 'altro';
      byCat[cid] = (byCat[cid] || 0) + Number(e.amount || 0);
    }
    const rows = Object.keys(byCat).map(function (cid) {
      const c = getCategory(categories, cid) || { id: cid, name: cid, icon: '📦', color: '#49454F' };
      return {
        category: c,
        total: round2(byCat[cid]),
        count: list.filter(function (e) { return (e.categoryId || 'altro') === cid; }).length
      };
    }).sort(function (a, b) { return b.total - a.total; });
    return { from: r.from, to: r.to, list, totals, byCategory: rows };
  }

  function monthlyOverview(entries, referenceISO) {
    const now=new Date((referenceISO||todayISO())+'T12:00:00');
    const current=monthRange(now.getFullYear(),now.getMonth()),previous=monthRange(now.getFullYear(),now.getMonth()-1);
    let currentCents=0,previousCents=0,pendingCents=0,pendingCount=0;
    for(const entry of entries||[]){
      if(entry.type!=='expense')continue;
      const cents=Math.round(Number(entry.amount||0)*100);
      if(entry.date>=current.from&&entry.date<=current.to)currentCents+=cents;
      if(entry.date>=previous.from&&entry.date<=previous.to)previousCents+=cents;
      const other=entry.payer==='person-a'?entry.shareG:entry.shareJ;
      if(entry.dueDate&&!entry.reimbursedAt&&Number(other)>0){pendingCents+=Math.round(Number(other)*100);pendingCount++;}
    }
    return {total:currentCents/100,previous:previousCents/100,difference:(currentCents-previousCents)/100,percentage:previousCents?Math.round((currentCents-previousCents)/previousCents*100):null,pending:pendingCents/100,pendingCount};
  }
  function recentExpenseSuggestions(entries, limit=5) {
    const seen=new Set();
    return (entries||[]).filter(entry=>entry.type==='expense').slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||(Number(b.created)||0)-(Number(a.created)||0)).filter(entry=>{
      const key=JSON.stringify([String(entry.desc||'').trim().toLocaleLowerCase('it-IT'),entry.amount,entry.payer,entry.categoryId,entry.shareJ,entry.shareG]);
      if(seen.has(key))return false;seen.add(key);return true;
    }).slice(0,limit);
  }
  function lastMonthsSeries(entries, n, nowDate) {
    const now = nowDate ? new Date(nowDate) : new Date();
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const r = monthRange(d.getFullYear(), d.getMonth());
      let total = 0, count = 0;
      for (const e of entries) {
        if (e.type !== 'expense') continue;
        if (e.date >= r.from && e.date <= r.to) { total += Number(e.amount || 0); count++; }
      }
      out.push({ year: d.getFullYear(), month: d.getMonth(), total: round2(total), count });
    }
    return out;
  }

  function addMonthClamped(dateISO, dayOfMonth) {
    const parts = String(dateISO).split('-').map(Number);
    if (parts.length !== 3 || !parts[0]) return null;
    const [y, m] = parts;
    const targetYear = y + Math.floor(m / 12);
    const monthIdx = ((m % 12) + 12) % 12;
    const lastDay = new Date(targetYear, monthIdx + 1, 0).getDate();
    const day = Math.min(dayOfMonth, lastDay);
    return targetYear + '-' + String(monthIdx + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }

  /* ---------- IMPOSTAZIONI ---------- */
  const DEFAULT_SETTINGS = {
    theme: 'system',
    setupCompleted: false,
    nameJ: 'Persona 1',
    nameG: 'Persona 2',
    themeColor: '#6750A4',
    secondaryColor: '',
    tertiaryColor: '',
    surfaceColor: '',
    personColorJ: '#6750A4',
    personColorG: '#7D5260',
    contrastLevel: 'standard',
    defaultPayer: 'person-a',
    defaultSplit: 'equal',
    defaultCategoryId: 'altro',
    navThird: 'budget',
    updatedAt: 0
  };

  function normalizePersonName(value, fallback) {
    return String(value == null ? '' : value).normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40) || fallback;
  }
  function personName(settings, id) {
    if (id === 'person-a') return normalizePersonName(settings && settings.nameJ, T.fragment('Persona 1'));
    if (id === 'person-b') return normalizePersonName(settings && settings.nameG, T.fragment('Persona 2'));
    return String(id || '');
  }
  function personInitial(settings, id) { return Array.from(personName(settings, id))[0]?.toLocaleUpperCase('it-IT') || ''; }
  function normalizeColor(value, fallback='') { return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim().toUpperCase() : fallback; }
  function normalizeSettings(input) {
    const src = (input && typeof input === 'object' && !Array.isArray(input)) ? input : {};
    const theme = ['system', 'light', 'dark'].indexOf(String(src.theme || '')) >= 0
      ? String(src.theme) : DEFAULT_SETTINGS.theme;
    const defaultPayer = (src.defaultPayer === 'person-a' || src.defaultPayer === 'person-b')
      ? src.defaultPayer : DEFAULT_SETTINGS.defaultPayer;
    const defaultSplit = src.defaultSplit === 'percent' ? 'percent' : DEFAULT_SETTINGS.defaultSplit;
    const defaultCategoryId = String(src.defaultCategoryId || '').trim().slice(0, 40)
      || DEFAULT_SETTINGS.defaultCategoryId;
    const navChoices = ['hidden','budget','reminders','pending','recurrences','categories','filters','history','trash'];
    const navThird = navChoices.includes(src.navThird) ? src.navThird : DEFAULT_SETTINGS.navThird;
    return {
      theme, setupCompleted:src.setupCompleted===true, nameJ: normalizePersonName(src.nameJ, T.fragment('Persona 1')), nameG: normalizePersonName(src.nameG, T.fragment('Persona 2')),
      themeColor: normalizeColor(src.themeColor, DEFAULT_SETTINGS.themeColor),
      secondaryColor: normalizeColor(src.secondaryColor), tertiaryColor: normalizeColor(src.tertiaryColor), surfaceColor: normalizeColor(src.surfaceColor),
      personColorJ: normalizeColor(src.personColorJ, DEFAULT_SETTINGS.personColorJ), personColorG: normalizeColor(src.personColorG, DEFAULT_SETTINGS.personColorG),
      contrastLevel: src.contrastLevel === 'high' ? 'high' : 'standard', defaultPayer, defaultSplit, defaultCategoryId, navThird,
      updatedAt: Number(src.updatedAt) || 0
    };
  }

  function pickNewerSettings(a, b) {
    const na = normalizeSettings(a), nb = normalizeSettings(b);
    return nb.updatedAt > na.updatedAt ? nb : na;
  }

  root.SpeseLogic = {
    uid, round2, esc,
    todayISO, isoDate, fmtDateShort, fmtDateLong, groupLabel, monthLabel, monthRange,
    fmtEur, humanSize,
    DEFAULT_CATEGORIES,
    DEFAULT_SETTINGS, normalizeSettings, pickNewerSettings, normalizePersonName, personName, personInitial, normalizeColor,
    normalizeCategory, normalizeCategories, getCategory, slugify,
    normalizeEntry, normalizeRecurrence,
    computeTotals, entryIsEqualSplit, entrySplitLabel,
    sharesFromPercent, percentFromShares,
    getDateRange, hasActiveFilters, applyFilters, filterByDateRange, periodLabel,
    monthStats, lastMonthsSeries, monthlyOverview, recentExpenseSuggestions,
    addMonthClamped
  };
})(typeof window !== 'undefined' ? window : this);
