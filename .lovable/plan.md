Replace the current favicon assets with the two uploaded images.

## Steps
1. Copy `user-uploads://favicon.png` → `public/favicon.png` (overwrite, used for all favicon sizes in `index.html`).
2. Copy `user-uploads://apple-touch-icon.png` → `public/apple-touch-icon.png`.
3. Update `index.html`: point the `apple-touch-icon` link to `/apple-touch-icon.png` instead of `/favicon.png`. Other favicon links already reference `/favicon.png` and stay unchanged.

No other files are touched. Browsers may cache the old icon — a hard refresh shows the new one.