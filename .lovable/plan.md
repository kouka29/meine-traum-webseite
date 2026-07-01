## Plan: Fix broken `position:fixed` for Chat Widget

### Problem
The Chat Widget scrolls away instead of staying fixed. Root cause: `overflow-x: clip` and `max-width: 100vw` applied to the `html` root element breaks `position:fixed` behavior in some browsers.

### Fix (1 file changed)
File: `src/index.css` (lines ~309-312)

Change:
```css
html, body {
  overflow-x: clip;
  max-width: 100vw;
}
```

To:
```css
body {
  overflow-x: clip;
  max-width: 100vw;
}
```

The `html` element receives **no** `overflow-x` and **no** `max-width`. Horizontal scroll remains prevented via `body`, while `position:fixed` on the Chat Widget works correctly again.

### Verification
- Run `bun run build` to confirm build stays green.
- No other files modified.