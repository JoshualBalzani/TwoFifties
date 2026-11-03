'use strict';

const express = require('express');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { promisify } = require('util');

const Core = require('./core');
const PORT = Number(process.env.PORT) || 80;
const PUBLIC_DIR = process.env.PUBLIC_DIR || path.join(__dirname, 'public');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, 'backups');
const RECEIPT_DIR = path.join(BACKUP_DIR, 'receipts');
const STATE_FILE = path.join(BACKUP_DIR, 'latest.json');
const RETENTION_DAYS = 90;
const RECURRENCE_JOB_INTERVAL = 30 * 60 * 1000;

const AUTH_USER = process.env.AUTH_USER || '';
const AUTH_PASS = process.env.AUTH_PASS || '';
const CLEAR_ALL_PASSWORD_HASH = process.env.CLEAR_ALL_PASSWORD_HASH || '';
const scrypt = promisify(crypto.scrypt);

const app = express();
app.use(express.json({ limit: '5mb' }));
const asyncRoute = handler => (req, res, next) => (req.method === 'GET'
  ? Promise.resolve().then(() => handler(req, res, next))
  : serial(() => handler(req, res, next))).catch(next);

/* ---------- BASIC AUTH ---------- */
app.use((req, res, next) => {
  if (!AUTH_USER) return next();
  const header = req.headers.authorization || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = Buffer.from(header.slice(6), 'base64').toString('utf8'); }
    catch (e) { decoded = ''; }
    const idx = decoded.indexOf(':');
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    if (user === AUTH_USER && pass === AUTH_PASS) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="TwoFifties", charset="UTF-8"');
  res.status(401).send('Autenticazione richiesta');
});

/* ---------- STATIC ---------- */
app.use(express.static(PUBLIC_DIR, {
  index: 'index.html',
  extensions: ['html'],
  etag: true,
  lastModified: true,
  setHeaders: function (res, filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      /* no-cache: index.html e i file JS devono sempre essere freschi insieme,
         altrimenti un deploy nuova index + logic.js vecchio (cache 1h) va in errore.
         Con ETag/Last-Modified il browser fa una richiesta condizionale → 304 leggero. */
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

/* ---------- UTILS ---------- */
async function ensureDir() { await fs.mkdir(BACKUP_DIR, { recursive: true }); }
async function readJson(file, fallback) { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return fallback; throw e; } }
async function writeJson(file, obj) {
  const body = JSON.stringify(obj, null, 2);
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, body);
  await fs.rename(tmp, file);
}
async function verifyClearAllPassword(password) {
  if (typeof password !== 'string' || password.length > 256) return false;
  const parts = CLEAR_ALL_PASSWORD_HASH.split(':');
  if (!/^[a-f0-9]{32}$/i.test(parts[0] || '') || !/^[a-f0-9]{128}$/i.test(parts[1] || '')) return false;
  const salt = Buffer.from(parts[0], 'hex');
  const expected = Buffer.from(parts[1], 'hex');
  const actual = await scrypt(password, salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}
function safeName(n) { return String(n || '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 128); }
function p2(n) { return String(n).padStart(2, '0'); }
function todayStamp() { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
function fullStamp() { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + 'T' + p2(d.getHours()) + '-' + p2(d.getMinutes()) + '-' + p2(d.getSeconds()); }
function round2(n) { return Math.round(Number(n) * 100) / 100; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function isoOf(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
function todayISO() { return isoOf(new Date()); }

/* ---------- RICORRENZE ---------- */
function normalizeRecurrence(r) {
  if (!r || typeof r !== 'object') return null;
  const amount = Number(r.amount);
  if (!isFinite(amount) || amount <= 0) return null;
  const day = Math.max(1, Math.min(31, parseInt(r.dayOfMonth, 10) || 1));
  const out = {
    id: String(r.id || uid()),
    desc: String(r.desc || 'Ricorrente').slice(0, 120),
    amount: round2(amount),
    payer: (r.payer === 'person-b') ? 'person-b' : 'person-a',
    categoryId: String(r.categoryId || 'altro'),
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
function addMonthClamped(dateISO, dayOfMonth) {
  const parts = String(dateISO).split('-').map(Number);
  if (parts.length !== 3 || !parts[0]) return null;
  const [y, m] = parts;
  const targetYear = y + Math.floor(m / 12);
  const monthIdx = ((m % 12) + 12) % 12;
  const lastDay = new Date(targetYear, monthIdx + 1, 0).getDate();
  const day = Math.min(dayOfMonth, lastDay);
  return targetYear + '-' + p2(monthIdx + 1) + '-' + p2(day);
}
function materializeRecurrence(rec, existingEntries) {
  if (!rec.active) return { newEntries: [], updatedRec: rec };
  const today = todayISO();
  const newEntries = [];
  let current = rec.lastGeneratedDate
    ? addMonthClamped(rec.lastGeneratedDate, rec.dayOfMonth)
    : rec.startDate;
  let safety = 0;
  while (current && current <= today && safety < 240) {
    safety++;
    const alreadyExists = existingEntries.some(e =>
      e.recurrenceId === rec.id && e.recurrenceDate === current);
    if (!alreadyExists) {
      const n = {
        id: uid(), type: 'expense', date: current, desc: rec.desc,
        amount: round2(rec.amount), payer: rec.payer,
        categoryId: rec.categoryId || 'altro',
        shareJ: rec.shareJ, shareG: rec.shareG,
        recurrenceId: rec.id, recurrenceDate: current,
        created: Date.now()
      };
      if (rec.note) n.note = rec.note;
      newEntries.push(n);
    }
    current = addMonthClamped(current, rec.dayOfMonth);
  }
  const updatedRec = Object.assign({}, rec);
  if (newEntries.length > 0) {
    updatedRec.lastGeneratedDate = newEntries[newEntries.length - 1].recurrenceDate;
  }
  return { newEntries, updatedRec };
}
function processRecurrences(entries, recurrences, pending = []) {
  const outPending = pending.slice();
  const outEntries = entries.slice();
  const outRecs = [];
  let generated = 0;
  for (const raw of recurrences) {
    const rec = normalizeRecurrence(raw);
    if (!rec) continue;
    const { newEntries, updatedRec } = materializeRecurrence(rec, outEntries.concat(outPending));
    for (const e of newEntries) {
      e.id = "rec-" + rec.id + "-" + e.recurrenceDate;
      if (rec.requiresConfirmation) outPending.push(e); else outEntries.push(e);
    }
    generated += newEntries.length;
    outRecs.push(updatedRec);
  }
  return { entries: outEntries, recurrences: outRecs, pending: outPending, generated };
}

/* ---------- BACKUP CLEANUP ---------- */
async function cleanupOldDaily() {
  let files;
  try { files = await fs.readdir(BACKUP_DIR); } catch (e) { return; }
  const cutoff = Date.now() - RETENTION_DAYS * 86400000;
  for (const f of files) {
    const m = f.match(/^daily-(\d{4}-\d{2}-\d{2})\.json$/);
    if (!m) continue;
    const t = new Date(m[1] + 'T00:00:00').getTime();
    if (t < cutoff) await fs.unlink(path.join(BACKUP_DIR, f)).catch(() => {});
  }
}

/* ---------- STATO ---------- */
let state = { entries: [], recurrences: [], categories: [], settings: {}, workspace: Core.workspace(), revision: 0, updatedAt: 0 };
let stateLoaded = false;
let writeLock = Promise.resolve();

async function loadState() {
  if (stateLoaded) return state;
  await ensureDir();
  const raw = await readJson(STATE_FILE, { entries: [], recurrences: [], categories: [], settings: {}, updatedAt: 0 });
  state = {
    entries: Array.isArray(raw.entries) ? raw.entries : [],
    recurrences: Array.isArray(raw.recurrences) ? raw.recurrences : [],
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    settings: (raw.settings && typeof raw.settings === 'object' && !Array.isArray(raw.settings)) ? raw.settings : {},
    workspace: Core.workspace(raw.workspace),
    revision: Number(raw.revision) || 0,
    updatedAt: Number(raw.updatedAt) || 0
  };
  stateLoaded = true;
  return state;
}
function persistState(snapshot = state) {
  writeLock = writeLock.catch(() => {}).then(async () => {
    await ensureDir();
    await writeJson(STATE_FILE, snapshot);
    const dailyFile = path.join(BACKUP_DIR, 'daily-' + todayStamp() + '.json');
    await writeJson(dailyFile, snapshot).catch(() => {});
    cleanupOldDaily().catch(() => {});
  });
  return writeLock;
}

// Serialize API access, including restore and recurrence jobs, to make revision checks atomic.
let transaction = Promise.resolve();
function serial(operation) {
  const next = transaction.catch(() => {}).then(operation);
  transaction = next.catch(() => {});
  return next;
}
async function commit(next, actor = 'Sistema', restoredHistory) {
  Core.reconcileReminders(next.entries);
  next.workspace = Core.workspace(next.workspace);
  const auditBase=restoredHistory===undefined?state:{...state,workspace:{...state.workspace,history:restoredHistory}};
  next.workspace.history = Core.audit(auditBase, next, actor);
  next.revision = state.revision + 1;
  next.updatedAt = Math.max(Date.now(), state.updatedAt + 1);
  await persistState(next);
  state = next;
  return state;
}
function draft() { return JSON.parse(JSON.stringify(state)); }
function actorOf(req) { return ['person-a','person-b'].includes(req.body && req.body.actor) ? req.body.actor : 'Dispositivo'; }
function generate(next) {
  const result = processRecurrences(next.entries, next.recurrences, next.workspace.pending);
  next.entries = result.entries; next.recurrences = result.recurrences; next.workspace.pending = result.pending;
  return result.generated;
}
function checkRevision(req, res) {
  if (!Number.isInteger(req.body && req.body.baseRevision)) { res.status(428).json({ error:'Aggiorna la pagina per usare la sincronizzazione protetta' }); return false; }
  if (req.body.baseRevision !== state.revision) { res.status(409).json({ error:'Lo stato e cambiato su un altro dispositivo', state }); return false; }
  return true;
}
/* ---------- API ---------- */
app.get('/api/health', (req, res) => { res.json({ status: 'ok' }); });

app.get('/api/state', asyncRoute(async (req, res) => { await loadState(); res.json(state); }));

app.post('/api/clear-all', asyncRoute(async (req, res) => {
  if (!CLEAR_ALL_PASSWORD_HASH) return res.status(503).json({ error: 'password non configurata' });
  try {
    if (!await verifyClearAllPassword(req.body && req.body.password)) {
      return res.status(403).json({ error: 'password non valida' });
    }
    await loadState();
    if (!checkRevision(req, res)) return;
    const file = 'pre-clear-' + fullStamp() + '-' + uid() + '.json';
    await writeJson(path.join(BACKUP_DIR, file), state);
    const next = draft(); next.entries = []; next.recurrences = []; next.workspace.trash = []; next.workspace.pending = [];
    await commit(next, actorOf(req));
    res.json({ ok: true, updatedAt: state.updatedAt, state });
  } catch (e) {
    console.error('clear-all error', e);
    res.status(500).json({ error: 'impossibile eliminare i dati' });
  }
}));

app.put('/api/state', asyncRoute(async (req, res) => {
  await loadState();
  if (!checkRevision(req, res)) return;
  const next = draft(), body = req.body;
  for (const key of ['entries','recurrences','categories']) if (Array.isArray(body[key])) next[key] = body[key];
  if (body.settings && typeof body.settings === 'object' && !Array.isArray(body.settings)) next.settings = body.settings;
  next.workspace = Core.workspace(body.workspace || next.workspace);
  Core.validate(next);
  for (const removed of state.entries) if (!next.entries.some(e=>e.id===removed.id) && !next.workspace.trash.some(t=>t.id===removed.id)) next.workspace.trash.push({id:removed.id,entry:removed,deletedAt:Date.now(),deletedBy:actorOf(req)});
  next.workspace.trash = next.workspace.trash.filter(t=>!next.entries.some(e=>e.id===t.id));
  generate(next);
  await commit(next, actorOf(req));
  res.json(state);
}));

app.post('/api/recurrences/run', asyncRoute(async (req, res) => {
  await loadState();
  const next = draft(), generated = generate(next);
  if (generated) await commit(next);
  res.json({ generated, state });
}));

app.get('/api/backups', asyncRoute(async (req, res) => {
  await ensureDir();
  let files = [];
  try { files = await fs.readdir(BACKUP_DIR); } catch (e) {}
  const out = [];
  for (const f of files) {
    if (!f.endsWith('.json') || f.endsWith('.tmp')) continue;
    if (f === 'latest.json') continue;
    const full = path.join(BACKUP_DIR, f);
    let st;
    try { st = await fs.stat(full); } catch (e) { continue; }
    let entryCount = null, recCount = null, catCount = null;
    const kind = f.startsWith('daily-') ? 'auto' : (f.startsWith('manual-') ? 'manual' : 'other');
    try {
      const s = JSON.parse(await fs.readFile(full, 'utf8'));
      if (Array.isArray(s.entries)) entryCount = s.entries.length;
      if (Array.isArray(s.recurrences)) recCount = s.recurrences.length;
      if (Array.isArray(s.categories)) catCount = s.categories.length;
    } catch (e) {}
    out.push({ file: f, kind, size: st.size, mtime: st.mtimeMs, entries: entryCount, recurrences: recCount, categories: catCount });
  }
  out.sort((a, b) => b.mtime - a.mtime);
  res.json(out);
}));

app.post('/api/backup', asyncRoute(async (req, res) => {
  await loadState();
  await ensureDir();
  const file = 'manual-' + fullStamp() + '-' + uid() + '.json';
  await writeJson(path.join(BACKUP_DIR, file), state);
  res.json({ ok: true, file });
}));

app.get('/api/backups/:file', asyncRoute(async (req, res) => {
  const file = safeName(req.params.file);
  if (!file) return res.status(400).end();
  try {
    const body = await fs.readFile(path.join(BACKUP_DIR, file), 'utf8');
    res.type('application/json').set('Content-Disposition', 'attachment; filename="' + file + '"').send(body);
  } catch (e) { res.status(404).json({ error: 'not found' }); }
}));

app.post('/api/restore', asyncRoute(async (req, res) => {
  let snap;
  if(req.body && Object.hasOwn(req.body,'snapshot')){
    snap=req.body.snapshot;
    if(!snap || typeof snap!=='object' || Array.isArray(snap) || !Array.isArray(snap.entries) || !Array.isArray(snap.recurrences) || !Array.isArray(snap.categories) || !snap.settings || typeof snap.settings!=='object' || Array.isArray(snap.settings))return res.status(400).json({error:'Seleziona un backup completo di TwoFifties, non un elenco di movimenti.'});
  }else{
    const file = safeName(req.body && req.body.file);
    if (!file) return res.status(400).json({ error: 'file richiesto' });
    try { snap = JSON.parse(await fs.readFile(path.join(BACKUP_DIR, file), 'utf8')); }
    catch (e) { return res.status(404).json({ error: 'backup non trovato' }); }
  }
  if (!snap || !Array.isArray(snap.entries)) return res.status(400).json({ error: 'backup non valido' });
  await loadState();
  if (!checkRevision(req, res)) return;
  const next = draft();
  next.entries = snap.entries;
  next.recurrences = Array.isArray(snap.recurrences) ? snap.recurrences : [];
  next.categories = Array.isArray(snap.categories) ? snap.categories : [];
  next.workspace = Core.workspace(snap.workspace);
  if (snap.settings && typeof snap.settings === 'object') next.settings = Object.assign({}, snap.settings, { updatedAt: Date.now() });
  Core.validate(next);
  // Validate before creating the safety copy or changing any persisted state.
  const safety = 'pre-restore-' + fullStamp() + '-' + uid() + '.json';
  await writeJson(path.join(BACKUP_DIR, safety), state);
  if(req.body && Object.hasOwn(req.body,'snapshot'))await writeJson(path.join(BACKUP_DIR,'manual-import-'+fullStamp()+'-'+uid()+'.json'),snap);
  await commit(next, actorOf(req), next.workspace.history);
  res.json(state);
}));

app.delete('/api/backups/:file', asyncRoute(async (req, res) => {
  const file = safeName(req.params.file);
  if (file === 'latest.json') return res.status(403).json({error:'Lo stato corrente non e un backup eliminabile'});
  if (!file) return res.status(400).end();
  try { await fs.unlink(path.join(BACKUP_DIR, file)); res.json({ ok: true }); }
  catch (e) { res.status(404).json({ error: 'not found' }); }
}));

/* Receipts live with the persistent backup volume; snapshots keep their references. */
app.post('/api/receipts', asyncRoute(async (req, res) => {
  const body = req.body || {};
  if (typeof body.data !== 'string' || body.data.length > 2800000) return res.status(400).json({error:'Ricevuta troppo grande'});
  const match = body.data.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return res.status(400).json({error:'Formato immagine non valido'});
  const data = Buffer.from(match[2], 'base64');
  const jpeg = data[0] === 255 && data[1] === 216 && data[2] === 255;
  const png = data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp = data.subarray(0,4).toString() === 'RIFF' && data.subarray(8,12).toString() === 'WEBP';
  if (!(match[1] === 'jpeg' ? jpeg : match[1] === 'png' ? png : webp) || data.length > 2*1024*1024) return res.status(400).json({error:'Immagine non valida o oltre 2 MB'});
  await fs.mkdir(RECEIPT_DIR, {recursive:true});
  const id = crypto.randomUUID() + '.' + (match[1] === 'jpeg' ? 'jpg' : match[1]);
  await fs.writeFile(path.join(RECEIPT_DIR,id), data, {flag:'wx'});
  res.status(201).json({id,name:String(body.name||'Ricevuta').slice(0,120),size:data.length});
}));
app.get('/api/receipts/:id', asyncRoute(async (req, res) => {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(req.params.id)) return res.status(404).end();
  res.set('Cache-Control','private, no-store').set('X-Content-Type-Options','nosniff');
  res.sendFile(path.join(RECEIPT_DIR,req.params.id), err => { if (err && !res.headersSent) res.status(404).end(); });
}));

app.use((err, req, res, next) => {
  console.error('API error', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: 'Operazione non completata: impossibile leggere o salvare i dati' });
});

/* ---------- JOB RICORRENZE ---------- */
let jobRunning = false;
async function runRecurrenceJob() {
  if (jobRunning) return;
  jobRunning = true;
  try {
    await loadState();
    await serial(async () => {
      const next = draft(), generated = generate(next);
      const oldTrash = next.workspace.trash.length;
      next.workspace = Core.workspace(next.workspace);
      if (generated || oldTrash !== next.workspace.trash.length) await commit(next);
    });
  } catch (e) { console.error('recurrence job error', e); }
  finally { jobRunning = false; }
}

/* ---------- AVVIO ---------- */
(async function start() {
  await ensureDir();
  await loadState();
  await runRecurrenceJob();
  setInterval(runRecurrenceJob, RECURRENCE_JOB_INTERVAL);
  app.listen(PORT, () => {
    console.log('Spese in ascolto sulla porta ' + PORT);
    console.log('Compressione: nessuna (safe mode)');
    if (AUTH_USER) console.log('Basic auth attiva (utente: ' + AUTH_USER + ')');
    else console.log('Basic auth DISATTIVATA (nessun AUTH_USER impostato)');
  });
})();
