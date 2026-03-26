# Password Generator Modernization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all `prompt()`/`alert()` dialogs with on-page controls and reskin the app with a modern sidebar layout using Tailwind CSS.

**Architecture:** Single-page vanilla JS app. HTML provides all DOM structure and Tailwind classes; a minimal CSS file handles only non-Tailwind concerns; `script.js` handles all interactivity — toggle state, slider live update, password generation, copy-to-clipboard, strength calculation, and rules summary. Each task shows the **complete file** to avoid ambiguity.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Inter font (Google Fonts), Vanilla JS (ES6+)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.html` | Full rewrite | Semantic structure, Tailwind classes, all DOM hooks |
| `assets/style.css` | Full rewrite | Only what Tailwind can't cover: box-sizing reset, font family, range accent, monospace font |
| `assets/script.js` | Full rewrite | All interactivity — toggles, slider, generation, copy, strength, rules |
| `README.md` | Update | Describe new UI and usage |

---

### Task 1: Rewrite index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the entire contents of `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Generator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">

  <header class="w-full max-w-2xl mb-6">
    <div class="bg-gray-900 rounded-2xl px-8 py-6 flex items-center gap-4">
      <div class="bg-white/10 rounded-xl p-3">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Password Generator</h1>
        <p class="text-sm text-gray-400 mt-0.5">Create a strong, secure password instantly</p>
      </div>
    </div>
  </header>

  <main class="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200 overflow-hidden">
    <div class="flex">

      <aside class="w-56 bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-6">

        <section aria-labelledby="length-label">
          <div class="flex justify-between items-center mb-3">
            <label id="length-label" for="length-slider" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Length</label>
            <output id="length-display" for="length-slider" class="text-lg font-bold text-gray-900">16</output>
          </div>
          <input id="length-slider" type="range" min="8" max="128" value="16" class="w-full h-2 cursor-pointer">
          <div class="flex justify-between text-xs text-gray-400 mt-1" aria-hidden="true">
            <span>8</span><span>128</span>
          </div>
        </section>

        <fieldset>
          <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Include</legend>
          <div class="flex flex-col gap-2">
            <button type="button" id="toggle-uppercase" aria-pressed="true"
              class="text-sm font-semibold py-2 px-3 rounded-lg text-left transition-all border-2 bg-gray-900 text-white border-gray-900">
              Aa Uppercase
            </button>
            <button type="button" id="toggle-lowercase" aria-pressed="true"
              class="text-sm font-semibold py-2 px-3 rounded-lg text-left transition-all border-2 bg-gray-900 text-white border-gray-900">
              aa Lowercase
            </button>
            <button type="button" id="toggle-numbers" aria-pressed="false"
              class="text-sm font-semibold py-2 px-3 rounded-lg text-left transition-all border-2 bg-white text-gray-500 border-gray-300 line-through decoration-gray-400">
              12 Numbers
            </button>
            <button type="button" id="toggle-symbols" aria-pressed="true"
              class="text-sm font-semibold py-2 px-3 rounded-lg text-left transition-all border-2 bg-gray-900 text-white border-gray-900">
              !@ Symbols
            </button>
          </div>
        </fieldset>

      </aside>

      <section class="flex-1 p-6 flex flex-col gap-4" aria-label="Password output">

        <div>
          <label for="password" class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Generated Password</label>
          <div class="relative">
            <output id="password" role="status" aria-live="polite" aria-label="Generated password"
              class="block w-full bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-xl p-4 font-mono text-lg text-gray-800 tracking-widest min-h-[64px] break-all leading-relaxed">
            </output>
            <button type="button" id="copy-btn" aria-label="Copy password to clipboard" disabled
              class="absolute top-2 right-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-900 hover:enabled:text-white hover:enabled:border-gray-900 shadow-sm flex items-center gap-1.5 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span id="copy-label">Copy</span>
            </button>
          </div>
          <p id="error-msg" role="alert" class="text-xs text-red-600 font-medium mt-2 hidden">Please enable at least one character type.</p>
        </div>

        <div id="strength-meter" role="meter" aria-label="Password strength" aria-valuenow="0" aria-valuemin="0" aria-valuemax="4">
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Strength</span>
            <span id="strength-label" class="text-xs font-semibold text-gray-400">—</span>
          </div>
          <div class="flex gap-1" aria-hidden="true">
            <div class="strength-seg h-1.5 flex-1 rounded-full bg-gray-200"></div>
            <div class="strength-seg h-1.5 flex-1 rounded-full bg-gray-200"></div>
            <div class="strength-seg h-1.5 flex-1 rounded-full bg-gray-200"></div>
            <div class="strength-seg h-1.5 flex-1 rounded-full bg-gray-200"></div>
          </div>
        </div>

        <aside aria-label="Active password rules" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
          <span class="font-semibold text-gray-700">Rules: </span>
          <span id="rules-summary">—</span>
        </aside>

        <button type="button" id="generate"
          class="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-gray-300 transition-all text-sm mt-auto">
          Generate Password
        </button>

      </section>
    </div>
  </main>

  <script src="assets/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open `index.html` in Chrome/Firefox and verify**

Expected (no JS running yet):
- Black header banner with lock icon, bold white "Password Generator" title
- White card with gray left sidebar and right output panel
- 3 black toggle buttons (Uppercase, Lowercase, Symbols), 1 white+strikethrough (Numbers)
- Length slider at 16
- Dashed output box (empty), faded copy button
- 4 gray strength segments
- Rules showing "—"
- Black "Generate Password" button at bottom

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite HTML with semantic structure and Tailwind layout"
```

---

### Task 2: Strip down assets/style.css

**Files:**
- Modify: `assets/style.css`

- [ ] **Step 1: Replace the entire contents of `assets/style.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
}

input[type="range"] {
  accent-color: #111827;
}

#password {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Visual appearance should be unchanged — Tailwind handles all other styling. The password output box should use a monospace font once a password is generated.

- [ ] **Step 3: Commit**

```bash
git add assets/style.css
git commit -m "feat: strip CSS to minimal Tailwind-compatible overrides"
```

---

### Task 3: Rewrite assets/script.js — toggles, slider, and rules summary

**Files:**
- Modify: `assets/script.js`

- [ ] **Step 1: Replace the entire contents of `assets/script.js`**

```js
const ACTIVE_CLASSES   = ['bg-gray-900', 'text-white', 'border-gray-900'];
const INACTIVE_CLASSES = ['bg-white', 'text-gray-500', 'border-gray-300', 'line-through', 'decoration-gray-400'];

const lengthSlider   = document.getElementById('length-slider');
const lengthDisplay  = document.getElementById('length-display');
const passwordOutput = document.getElementById('password');
const copyBtn        = document.getElementById('copy-btn');
const copyLabel      = document.getElementById('copy-label');
const errorMsg       = document.getElementById('error-msg');
const strengthMeter  = document.getElementById('strength-meter');
const strengthLabel  = document.getElementById('strength-label');
const strengthSegs   = document.querySelectorAll('.strength-seg');
const rulesSummary   = document.getElementById('rules-summary');
const generateBtn    = document.getElementById('generate');

const toggles = {
  uppercase: document.getElementById('toggle-uppercase'),
  lowercase: document.getElementById('toggle-lowercase'),
  numbers:   document.getElementById('toggle-numbers'),
  symbols:   document.getElementById('toggle-symbols'),
};

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '~!@#$%^&*_+?',
};

function setToggle(btn, active) {
  btn.setAttribute('aria-pressed', String(active));
  if (active) {
    btn.classList.remove(...INACTIVE_CLASSES);
    btn.classList.add(...ACTIVE_CLASSES);
  } else {
    btn.classList.remove(...ACTIVE_CLASSES);
    btn.classList.add(...INACTIVE_CLASSES);
  }
}

function getActiveTypes() {
  return Object.entries(toggles)
    .filter(([, btn]) => btn.getAttribute('aria-pressed') === 'true')
    .map(([key]) => key);
}

function updateRulesSummary() {
  const active = getActiveTypes();
  const typeLabels = { uppercase: 'uppercase', lowercase: 'lowercase', numbers: 'numbers', symbols: 'symbols' };
  const typeParts = active.map(k => typeLabels[k]);
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...typeParts].join(' · ');
}

Object.values(toggles).forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.getAttribute('aria-pressed') === 'true';
    setToggle(btn, !isActive);
    updateRulesSummary();
  });
});

lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateRulesSummary();
});

// Stubs filled in later tasks
function generatePassword() { return null; }
function getStrengthScore(password, activeTypes) { return 0; }
function updateStrength(score) {}

generateBtn.addEventListener('click', () => {});
copyBtn.addEventListener('click', () => {});

updateRulesSummary();
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Test:
1. Click each toggle — it should flip between black (active) and white+strikethrough (inactive)
2. Drag the length slider — the number above should update live
3. Rules summary below the strength bar should update as you interact with controls
4. "Generate Password" button does nothing yet (stub) — that's expected

- [ ] **Step 3: Commit**

```bash
git add assets/script.js
git commit -m "feat: add toggle interactivity, slider live update, and rules summary"
```

---

### Task 4: Add password generation and inline validation

**Files:**
- Modify: `assets/script.js`

- [ ] **Step 1: Replace the entire contents of `assets/script.js`**

Same as Task 3 but with `generatePassword`, `getStrengthScore`, and `generateBtn` listener filled in:

```js
const ACTIVE_CLASSES   = ['bg-gray-900', 'text-white', 'border-gray-900'];
const INACTIVE_CLASSES = ['bg-white', 'text-gray-500', 'border-gray-300', 'line-through', 'decoration-gray-400'];

const lengthSlider   = document.getElementById('length-slider');
const lengthDisplay  = document.getElementById('length-display');
const passwordOutput = document.getElementById('password');
const copyBtn        = document.getElementById('copy-btn');
const copyLabel      = document.getElementById('copy-label');
const errorMsg       = document.getElementById('error-msg');
const strengthMeter  = document.getElementById('strength-meter');
const strengthLabel  = document.getElementById('strength-label');
const strengthSegs   = document.querySelectorAll('.strength-seg');
const rulesSummary   = document.getElementById('rules-summary');
const generateBtn    = document.getElementById('generate');

const toggles = {
  uppercase: document.getElementById('toggle-uppercase'),
  lowercase: document.getElementById('toggle-lowercase'),
  numbers:   document.getElementById('toggle-numbers'),
  symbols:   document.getElementById('toggle-symbols'),
};

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '~!@#$%^&*_+?',
};

function setToggle(btn, active) {
  btn.setAttribute('aria-pressed', String(active));
  if (active) {
    btn.classList.remove(...INACTIVE_CLASSES);
    btn.classList.add(...ACTIVE_CLASSES);
  } else {
    btn.classList.remove(...ACTIVE_CLASSES);
    btn.classList.add(...INACTIVE_CLASSES);
  }
}

function getActiveTypes() {
  return Object.entries(toggles)
    .filter(([, btn]) => btn.getAttribute('aria-pressed') === 'true')
    .map(([key]) => key);
}

function updateRulesSummary() {
  const active = getActiveTypes();
  const typeLabels = { uppercase: 'uppercase', lowercase: 'lowercase', numbers: 'numbers', symbols: 'symbols' };
  const typeParts = active.map(k => typeLabels[k]);
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...typeParts].join(' · ');
}

function generatePassword(activeTypes) {
  const length = parseInt(lengthSlider.value);
  const chars  = activeTypes.map(k => charSets[k]).join('');
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getStrengthScore(password, activeTypes) {
  const lengthBonus = password.length >= 16 ? 1 : 0;
  return Math.min(activeTypes.length + lengthBonus, 4);
}

// Stub — filled in Task 5
function updateStrength(score) {}

Object.values(toggles).forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.getAttribute('aria-pressed') === 'true';
    setToggle(btn, !isActive);
    updateRulesSummary();
  });
});

lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateRulesSummary();
});

generateBtn.addEventListener('click', () => {
  const active = getActiveTypes();
  if (active.length === 0) {
    errorMsg.classList.remove('hidden');
    return;
  }
  errorMsg.classList.add('hidden');
  const password = generatePassword(active);
  passwordOutput.textContent = password;
  copyBtn.disabled = false;
  copyLabel.textContent = 'Copy';
  updateStrength(getStrengthScore(password, active));
});

// Stub — filled in Task 5
copyBtn.addEventListener('click', () => {});

updateRulesSummary();
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Test:
1. Click "Generate Password" with at least one toggle active — a password appears in the output box
2. Deactivate all four toggles and click Generate — red error message appears: "Please enable at least one character type."
3. Re-enable a toggle and generate again — error disappears, password appears
4. Copy button is no longer faded after generating — clicking it does nothing yet (stub)

- [ ] **Step 3: Commit**

```bash
git add assets/script.js
git commit -m "feat: add password generation with inline validation"
```

---

### Task 5: Add copy to clipboard

**Files:**
- Modify: `assets/script.js`

- [ ] **Step 1: Replace the entire contents of `assets/script.js`**

Same as Task 4 but with `copyBtn` listener filled in and `updateStrength` still stubbed:

```js
const ACTIVE_CLASSES   = ['bg-gray-900', 'text-white', 'border-gray-900'];
const INACTIVE_CLASSES = ['bg-white', 'text-gray-500', 'border-gray-300', 'line-through', 'decoration-gray-400'];

const lengthSlider   = document.getElementById('length-slider');
const lengthDisplay  = document.getElementById('length-display');
const passwordOutput = document.getElementById('password');
const copyBtn        = document.getElementById('copy-btn');
const copyLabel      = document.getElementById('copy-label');
const errorMsg       = document.getElementById('error-msg');
const strengthMeter  = document.getElementById('strength-meter');
const strengthLabel  = document.getElementById('strength-label');
const strengthSegs   = document.querySelectorAll('.strength-seg');
const rulesSummary   = document.getElementById('rules-summary');
const generateBtn    = document.getElementById('generate');

const toggles = {
  uppercase: document.getElementById('toggle-uppercase'),
  lowercase: document.getElementById('toggle-lowercase'),
  numbers:   document.getElementById('toggle-numbers'),
  symbols:   document.getElementById('toggle-symbols'),
};

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '~!@#$%^&*_+?',
};

function setToggle(btn, active) {
  btn.setAttribute('aria-pressed', String(active));
  if (active) {
    btn.classList.remove(...INACTIVE_CLASSES);
    btn.classList.add(...ACTIVE_CLASSES);
  } else {
    btn.classList.remove(...ACTIVE_CLASSES);
    btn.classList.add(...INACTIVE_CLASSES);
  }
}

function getActiveTypes() {
  return Object.entries(toggles)
    .filter(([, btn]) => btn.getAttribute('aria-pressed') === 'true')
    .map(([key]) => key);
}

function updateRulesSummary() {
  const active = getActiveTypes();
  const typeLabels = { uppercase: 'uppercase', lowercase: 'lowercase', numbers: 'numbers', symbols: 'symbols' };
  const typeParts = active.map(k => typeLabels[k]);
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...typeParts].join(' · ');
}

function generatePassword(activeTypes) {
  const length = parseInt(lengthSlider.value);
  const chars  = activeTypes.map(k => charSets[k]).join('');
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getStrengthScore(password, activeTypes) {
  const lengthBonus = password.length >= 16 ? 1 : 0;
  return Math.min(activeTypes.length + lengthBonus, 4);
}

// Stub — filled in Task 6
function updateStrength(score) {}

Object.values(toggles).forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.getAttribute('aria-pressed') === 'true';
    setToggle(btn, !isActive);
    updateRulesSummary();
  });
});

lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateRulesSummary();
});

generateBtn.addEventListener('click', () => {
  const active = getActiveTypes();
  if (active.length === 0) {
    errorMsg.classList.remove('hidden');
    return;
  }
  errorMsg.classList.add('hidden');
  const password = generatePassword(active);
  passwordOutput.textContent = password;
  copyBtn.disabled = false;
  copyLabel.textContent = 'Copy';
  updateStrength(getStrengthScore(password, active));
});

copyBtn.addEventListener('click', () => {
  const text = passwordOutput.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copyLabel.textContent = 'Copied!';
    setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
  });
});

updateRulesSummary();
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Test:
1. Generate a password
2. Click the Copy button — label changes to "Copied!" immediately
3. After 2 seconds, label reverts to "Copy"
4. Paste into a text editor — confirm the pasted text matches the displayed password exactly

- [ ] **Step 3: Commit**

```bash
git add assets/script.js
git commit -m "feat: add copy to clipboard with 2s feedback"
```

---

### Task 6: Add strength indicator

**Files:**
- Modify: `assets/script.js`

- [ ] **Step 1: Replace the entire contents of `assets/script.js`** (final version — no more stubs)

```js
const ACTIVE_CLASSES   = ['bg-gray-900', 'text-white', 'border-gray-900'];
const INACTIVE_CLASSES = ['bg-white', 'text-gray-500', 'border-gray-300', 'line-through', 'decoration-gray-400'];

const STRENGTH_CONFIG = [
  { label: '—',           color: 'bg-gray-200',   textClass: 'text-gray-400'    },
  { label: 'Weak',        color: 'bg-red-400',     textClass: 'text-red-500'     },
  { label: 'Fair',        color: 'bg-amber-400',   textClass: 'text-amber-500'   },
  { label: 'Strong',      color: 'bg-emerald-400', textClass: 'text-emerald-600' },
  { label: 'Very Strong', color: 'bg-emerald-500', textClass: 'text-emerald-700' },
];

const lengthSlider   = document.getElementById('length-slider');
const lengthDisplay  = document.getElementById('length-display');
const passwordOutput = document.getElementById('password');
const copyBtn        = document.getElementById('copy-btn');
const copyLabel      = document.getElementById('copy-label');
const errorMsg       = document.getElementById('error-msg');
const strengthMeter  = document.getElementById('strength-meter');
const strengthLabel  = document.getElementById('strength-label');
const strengthSegs   = document.querySelectorAll('.strength-seg');
const rulesSummary   = document.getElementById('rules-summary');
const generateBtn    = document.getElementById('generate');

const toggles = {
  uppercase: document.getElementById('toggle-uppercase'),
  lowercase: document.getElementById('toggle-lowercase'),
  numbers:   document.getElementById('toggle-numbers'),
  symbols:   document.getElementById('toggle-symbols'),
};

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '~!@#$%^&*_+?',
};

function setToggle(btn, active) {
  btn.setAttribute('aria-pressed', String(active));
  if (active) {
    btn.classList.remove(...INACTIVE_CLASSES);
    btn.classList.add(...ACTIVE_CLASSES);
  } else {
    btn.classList.remove(...ACTIVE_CLASSES);
    btn.classList.add(...INACTIVE_CLASSES);
  }
}

function getActiveTypes() {
  return Object.entries(toggles)
    .filter(([, btn]) => btn.getAttribute('aria-pressed') === 'true')
    .map(([key]) => key);
}

function updateRulesSummary() {
  const active = getActiveTypes();
  const typeLabels = { uppercase: 'uppercase', lowercase: 'lowercase', numbers: 'numbers', symbols: 'symbols' };
  const typeParts = active.map(k => typeLabels[k]);
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...typeParts].join(' · ');
}

function generatePassword(activeTypes) {
  const length = parseInt(lengthSlider.value);
  const chars  = activeTypes.map(k => charSets[k]).join('');
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getStrengthScore(password, activeTypes) {
  const lengthBonus = password.length >= 16 ? 1 : 0;
  return Math.min(activeTypes.length + lengthBonus, 4);
}

function updateStrength(score) {
  const config = STRENGTH_CONFIG[score];
  strengthLabel.textContent = config.label;
  strengthLabel.className = `text-xs font-semibold ${config.textClass}`;
  strengthMeter.setAttribute('aria-valuenow', score);
  strengthSegs.forEach((seg, i) => {
    seg.className = `strength-seg h-1.5 flex-1 rounded-full ${i < score ? config.color : 'bg-gray-200'}`;
  });
}

Object.values(toggles).forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.getAttribute('aria-pressed') === 'true';
    setToggle(btn, !isActive);
    updateRulesSummary();
  });
});

lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateRulesSummary();
});

generateBtn.addEventListener('click', () => {
  const active = getActiveTypes();
  if (active.length === 0) {
    errorMsg.classList.remove('hidden');
    return;
  }
  errorMsg.classList.add('hidden');
  const password = generatePassword(active);
  passwordOutput.textContent = password;
  copyBtn.disabled = false;
  copyLabel.textContent = 'Copy';
  updateStrength(getStrengthScore(password, active));
});

copyBtn.addEventListener('click', () => {
  const text = passwordOutput.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copyLabel.textContent = 'Copied!';
    setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
  });
});

updateRulesSummary();
```

- [ ] **Step 2: Verify each strength level in browser**

Reload `index.html`. For each row below, set up the toggles and slider, click Generate, and confirm the label and bar color match:

| Active types | Length | Expected label | Bar color |
|---|---|---|---|
| 1 type only | 8 | Weak | 1 red segment |
| 2 types | 8 | Fair | 2 amber segments |
| 3 types | 8 | Strong | 3 green segments |
| 4 types | 8 | Very Strong | 4 dark-green segments |
| 1 type | 16+ | Fair | 2 amber segments |
| 2 types | 16+ | Strong | 3 green segments |
| 3 types | 16+ | Very Strong | 4 dark-green segments |
| 4 types | 16+ | Very Strong | 4 dark-green segments (capped) |

- [ ] **Step 3: Commit**

```bash
git add assets/script.js
git commit -m "feat: add password strength indicator"
```

---

### Task 7: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current README.md first**

Read `README.md` to see what's currently there before overwriting.

- [ ] **Step 2: Replace the entire contents of `README.md`**

```markdown
# Password Generator

A modern, browser-based password generator. No server required — open `index.html` directly in any browser.

## How to use

1. **Set the length** — drag the slider (8–128 characters)
2. **Choose character types** — click the toggles to include or exclude uppercase, lowercase, numbers, and symbols. Black = active; white with strikethrough = inactive.
3. **Click Generate Password** — a new password appears in the output box
4. **Copy** — click the Copy button to copy to your clipboard. The label changes to "Copied!" for 2 seconds, then resets.

## Features

- On-page controls — no browser popups or dialogs
- Password strength indicator (Weak / Fair / Strong / Very Strong)
- One-click copy to clipboard
- Semantic HTML with ARIA attributes for screen reader support
- Responsive sidebar layout
- Styled with Tailwind CSS (via CDN) and Inter font

## Tech

HTML5 · Tailwind CSS (CDN) · Vanilla JavaScript · Inter + monospace fonts (Google Fonts)
```

- [ ] **Step 3: Verify**

Read through `README.md` and confirm it accurately describes how the app works now.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for modernized UI"
```

---

## Done

All tasks complete. The app now has:
- Zero `prompt()` / `alert()` calls
- Sidebar layout with live on-page controls
- Tailwind CSS styling with black/gray design system
- Strength indicator, copy button, inline validation, and rules summary
- Fully semantic, accessible HTML
