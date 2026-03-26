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
- Cryptographically secure password generation using `crypto.getRandomValues()`

## Tech

HTML5 · Tailwind CSS (CDN) · Vanilla JavaScript · Inter + monospace fonts (Google Fonts)
