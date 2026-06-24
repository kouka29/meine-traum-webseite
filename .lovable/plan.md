## Problem

Auf `/kostenlose-vorschau` zeigt das Testimonial-Carousel nur **eine** Karte rechts (Thomas M.) – die zwei weiteren Slots im 3-spaltigen Grid bleiben optisch leer, obwohl in der DB 12 sichtbare Testimonials vorhanden sind und die Dots korrekt 12 Stück anzeigen.

## Ursache

In `src/pages/KostenloseVorschauV2.tsx` (Zeile 1860–1865) wird das Carousel mit
```ts
opts={{ align: "start", loop: …, direction: "rtl" as const }}
```
initialisiert. Die `direction: "rtl"`-Option in Embla zusammen mit `align: "start"` positioniert den ersten Slide am rechten Rand und stapelt die weiteren Slides **außerhalb** des sichtbaren Viewports nach links/rechts – im Zusammenspiel mit `basis-1/3` werden die anderen zwei Karten dadurch nicht im sichtbaren Track gerendert. Das Demos-Carousel direkt darüber nutzt **kein** RTL und funktioniert einwandfrei – das bestätigt die Ursache.

## Fix

In `src/pages/KostenloseVorschauV2.tsx`, Zeile 1861, `direction: "rtl" as const` aus dem opts-Objekt entfernen:

```ts
opts={{ align: "start", loop: activeTestimonials.length > 3 }}
```

Sonst nichts ändern – Loop, Autoplay, Dots, Card-Styling bleiben unverändert. Damit fließt das Carousel wie das Demos-Carousel von links nach rechts, alle drei sichtbaren Karten werden korrekt befüllt, der Autoplay läuft normal.

## Verifikation

Nach dem Fix prüfen: auf `/kostenlose-vorschau` muss die Testimonial-Sektion drei Karten gleichzeitig (ab `lg`) bzw. zwei (`sm`) bzw. eine (mobile) anzeigen, alle mit Sternen, Zitat, Name, Rolle und Result-Badge.