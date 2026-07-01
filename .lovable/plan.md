File: src/components/trade/FeatureCard.tsx
Replace the bare EmojiIcon with a 48px icon container matching the homepage style.

Exact change:
```tsx
// Before:
<EmojiIcon emoji={emoji} size={20} />

// After:
<div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mb-1">
  <EmojiIcon emoji={emoji} size={24} />
</div>
```

No other changes. Build should remain green.