# Modernize Password Generator — Design Spec

**Date:** 2026-03-26
**Status:** Approved

---

## Overview

Modernize the password generator by replacing all `prompt()`/`alert()` dialogs with on-page controls, reskinning the UI with Tailwind CSS, and adding a copy-to-clipboard button and password strength indicator.

---

## Layout

**Sidebar layout** — a two-panel card:

- **Left panel (`<aside>`)**: password configuration controls (length slider + character type toggles)
- **Right panel (`<section>`)**: password output, copy button, strength meter, rules summary, generate button

Above the card sits a full-width **black header banner** (`<header>`) containing the lock icon and app title.

---

## Visual Style

**Clean Light** with black action elements:

- Background: soft indigo-to-purple gradient (`from-indigo-50 via-white to-purple-50`)
- Card: white, `rounded-2xl`, `shadow-xl`
- Header: `bg-gray-900` banner, white bold text, lock icon in frosted tile
- Active toggles: `bg-gray-900 text-white border-gray-900`
- Inactive toggles: `bg-white text-gray-500 border-gray-300` + strikethrough text — visually distinct "off" state
- Generate button: `bg-gray-900` full-width, rounds to `rounded-xl`
- Typography: Inter font via Google Fonts
- Password display: monospace font, dashed border, soft gradient background

---

## Controls (replacing all prompt/alert dialogs)

### Length Slider
- `<input type="range">` from 8 to 128
- Single value (no min/max range — user picks one exact length)
- Live `<output>` element displays the current value above the slider
- Default: 16

### Character Type Toggles
- Four `<button aria-pressed>` toggles inside a `<fieldset>` + `<legend>`:
  - Aa Uppercase
  - aa Lowercase
  - 12 Numbers
  - !@ Symbols
- Clicking toggles `aria-pressed` between `true`/`false` and switches the visual state (black ↔ white+border+strikethrough)
- At least one must be active — if the user tries to generate with none selected, show an inline error message (no `alert()`)

---

## Password Output

- `<output role="status" aria-live="polite">` — screen readers announce new passwords
- Monospace display with dashed border
- **Copy to clipboard button** overlaid top-right of the output box
  - On click: copies the password text, button label changes to "Copied!" for 2 seconds then resets
  - Disabled/hidden when no password has been generated yet

---

## Strength Indicator

Calculated from the active character set and length. Four segments:

| Score | Label | Color |
|-------|-------|-------|
| 1 | Weak | red |
| 2 | Fair | amber |
| 3 | Strong | emerald |
| 4 | Very Strong | emerald (all 4 segments) |

Scoring logic (capped at 4):
- +1 per active character type (max 4)
- +1 if length ≥ 16, but only if it pushes the score above what character types alone give (i.e., score = min(activeTypes + lengthBonus, 4))

`role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for accessibility.

---

## Rules Summary

A small `<aside>` below the strength meter shows the active rules in plain text:
`Rules: 16 chars · uppercase · lowercase · symbols`

Updates live whenever controls change. Replaces the dynamically-injected `#rules-container` div from the old JS.

---

## Semantic HTML

All elements use appropriate semantic tags:
- `<header>` for the black banner
- `<main>` wrapping the card
- `<aside>` for the sidebar and rules summary
- `<section>` for the output panel
- `<fieldset>` + `<legend>` for character type group
- `<label>` + `<output>` for the length slider
- `aria-pressed` on toggle buttons
- `aria-live="polite"` on password output
- `aria-hidden="true"` on decorative icons

---

## Implementation Stack

- **Tailwind CSS** via CDN (`<script src="https://cdn.tailwindcss.com">`)
- **Inter** font via Google Fonts
- Vanilla JS — no framework, no build step
- All JS stays in `assets/script.js`, all CSS in `assets/style.css` (Tailwind supplements, not replaces, the stylesheet)

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Full rewrite — semantic structure, Tailwind classes, new layout |
| `assets/style.css` | Stripped down to only what Tailwind can't cover (font import, range accent color, monospace font stack) |
| `assets/script.js` | Full rewrite — remove all `prompt()`/`alert()`, add toggle logic, slider live update, copy-to-clipboard, strength calculation, inline validation |
| `README.md` | Update to describe the modernized UI and how to use it |

---

## Out of Scope

- No build step or bundler
- No password history or saved preferences
- No backend or API
