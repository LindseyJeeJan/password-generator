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
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...active].join(' · ');
}

function generatePassword(activeTypes) {
  const length = parseInt(lengthSlider.value, 10);
  const chars  = activeTypes.map(k => charSets[k]).join('');
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, v => chars[v % chars.length]).join('');
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
copyBtn.addEventListener('click', () => {
  const text = passwordOutput.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copyLabel.textContent = 'Copied!';
    setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
  });
});

updateRulesSummary();
