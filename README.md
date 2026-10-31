# Portfolio – Muhammad Fahmi

Static portfolio website (HTML, CSS, JS – no build step).

## Publish with GitHub Pages
1. Create a new repository on GitHub, e.g. `portfolio` (or `<username>.github.io` for a root URL).
2. Upload everything in this folder (keep `index.html`, `css/`, `js/`, `assets/` at the top level), or:
   ```bash
   git init
   git add .
   git commit -m "Add portfolio website"
   git branch -M main
   git remote add origin https://github.com/<username>/portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://<username>.github.io/portfolio/`.

## Edit
- Text and images live in `index.html`; images are in `assets/img/`.
- Colors and fonts are CSS variables at the top of `css/style.css`.

## Interactive features
- Hero signal: drag the slider (or move/touch across the wave) to morph between industrial control (square wave) and analog/RF (sine wave).
- Light / dark mode (remembers your choice), reading progress bar, back-to-top button.
- Hover/focus on any Work, Project or Organization entry highlights it and softly dims the others (on touch screens the entry you are reading is marked).
- Project filter chips and clickable topic tags.
- Tool logos show their name on hover or tap.
- Photo galleries: hover captions, full-screen viewer with swipe, arrow keys and tap-to-zoom.
- One-tap "Copy" buttons for email, LinkedIn and phone number.
