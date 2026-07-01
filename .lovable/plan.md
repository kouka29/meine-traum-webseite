Zwei Trade-Unterseiten rendern noch rohe Emoji-Zeichen statt Lucide-Icons im Startseiten-Stil (48px-Container).

Änderungen:

1. **src/lib/emojiToIcon.tsx** — Ergänze fehlende Emoji→Lucide-Mappings:
   - ✍️ → `Pencil`
   - 📩 → `Mail`
   - 🔨 → `Hammer`
   - 🎯 → `Target`

2. **src/pages/trade/HandwerkerLeistungen.tsx** (~Zeile 89):
   - Import `EmojiIcon` hinzufügen.
   - Ersetze `<div className="text-3xl">{s.emoji}</div>` durch:
     ```jsx
     <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
       <EmojiIcon emoji={s.emoji} size={24} />
     </div>
     ```

3. **src/pages/trade/HandwerkerUeberUns.tsx** (~Zeile 50):
   - Import `EmojiIcon` hinzufügen.
   - Ersetze `<div className="text-3xl mb-3">{v.emoji}</div>` durch:
     ```jsx
     <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mb-3">
       <EmojiIcon emoji={v.emoji} size={24} />
     </div>
     ```

Keine anderen Änderungen. Build muss grün bleiben.