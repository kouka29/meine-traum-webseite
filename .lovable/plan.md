## Goal
Wrap bare EmojiIcon calls in `src/components/trade/TradeHub.tsx` inside styled containers matching the homepage icon style (rounded background, centered, consistent sizing).

## Changes

### 1) PainPoint cards (line 92)
Replace bare `<EmojiIcon emoji={p.icon} size={20} />` with:
```tsx
<div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
  <EmojiIcon emoji={p.icon} size={24} />
</div>
```

### 2) Cross-links / trade tiles (line 167)
Replace bare `<EmojiIcon emoji={t.icon} size={20} />` with:
```tsx
<div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
  <EmojiIcon emoji={t.icon} size={24} />
</div>
```

### 3) Process steps (line 108)
Replace bare `<EmojiIcon emoji={s.emoji} size={20} />` with:
```tsx
<div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
  <EmojiIcon emoji={s.emoji} size={20} />
</div>
```

## Verification
- Run build to confirm green.
- No other files touched.
