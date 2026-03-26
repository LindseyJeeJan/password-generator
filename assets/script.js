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
  rulesSummary.textContent = [lengthSlider.value + ' chars', ...active].join(' · ');
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
