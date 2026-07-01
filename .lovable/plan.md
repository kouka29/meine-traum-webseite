## Plan: Quick-Reply Chips in ChatAssistant

### Scope
Only `src/components/ChatAssistant.tsx` — additive changes, no backend touches.

### What we build

1. **Suggestion config**
   - Add `SUGGESTIONS` map (pathname → array of chip strings) and `DEFAULT_CHIPS` fallback.
   - Add `getSuggestions(pathname)` that resolves the best match once (computed at component mount or when pathname changes).

2. **Chip UI**
   - Render chips directly under the greeting assistant message.
   - Condition: only while the user has not yet sent any own message (`messages` contains zero user messages).
   - Styling: small pills (`rounded-full`, `border border-border`, `text-sm`, `px-3 py-1.5`, `hover:bg-muted`, brand-accent on hover). Max 4 visible.
   - Mobile: wrapping flex layout so they don’t overflow.
   - Accessibility: each chip is a `<button>` with `aria-label`.

3. **Chip interaction**
   - On click: prepend the chip text as a `user` message to `messages`, then invoke the existing `sendMessage` logic (or extract a `sendUserMessage(text)` helper so both textarea and chips share the same send path).
   - After a user message exists (including chip clicks), chips are hidden.

4. **Optional re-show**
   - After an assistant reply, show a subtle text link/button "Weitere Fragen" that re-renders the chips from `getSuggestions`. Clicking it hides the link again.

5. **No-op guardrails**
   - Do not modify Supabase/Stripe/Pixel/Kundenportal code.
   - Ensure build passes and lint count does not exceed current baseline.

### Files changed
- `src/components/ChatAssistant.tsx` only.

### Not changed
- Edge functions, auth, checkout, pricing, pixel, sitemap, or any other page/component.