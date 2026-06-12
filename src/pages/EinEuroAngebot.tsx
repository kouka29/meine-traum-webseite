import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { submitVorschauAnfrage } from "@/lib/vorschauSlots";

const testimonials = [
  { quote: "Ich hatte keine Ahnung dass mein Cookie-Banner nicht korrekt war. Muad hat das sofort erkannt und innerhalb von 3 Wochen hatten wir eine komplett neue, konforme Webseite.", name: "Thomas K., Elektriker aus Mainz" },
  { quote: "Endlich eine Webseite, die wirklich funktioniert. Mehr Anfragen, professionelles Auftreten und ich muss mich um nichts kümmern.", name: "Sandra M., Steuerberaterin aus Frankfurt" },
  { quote: "Schnell, unkompliziert, und das Ergebnis überzeugt. Meine neue Webseite ist jetzt gesetzeskonform und sieht besser aus als vorher.", name: "Ali B., Sanitärbetrieb Wiesbaden" },
];

const includes = [
  { icon: "🎨", title: "Individuelles Design", text: "Keine Vorlage. Maßgeschneidert für Ihr Unternehmen." },
  { icon: "⚖️", title: "BFSG- & DSGVO-konform", text: "Rechtssicher von Anfang an — keine Abmahnrisiken." },
  { icon: "📱", title: "Mobil optimiert", text: "Perfekt auf jedem Gerät — Smartphone, Tablet, Desktop." },
  { icon: "🚀", title: "In 2-4 Wochen online", text: "Schnelle Umsetzung ohne Qualitätsverlust." },
];

const steps = [
  { n: 1, title: "Sie sichern sich das Angebot", text: "Formular ausfüllen, wir melden uns innerhalb von 48 Stunden für ein kurzes Kennenlerngespräch." },
  { n: 2, title: "Wir bauen Ihre Webseite", text: "In 2-4 Wochen entsteht Ihre neue, professionelle Webseite — abgestimmt mit Ihnen." },
  { n: 3, title: "Sie zahlen 1 € für Monat 1", text: "Ab Monat 2: 59 €/Monat bei 12 Monaten Mindestlaufzeit. Enthält Hosting, Wartung und Support." },
];

const transparency = [
  "1 € für den ersten Monat — danach 59 €/Monat",
  "12 Monate Mindestlaufzeit (Details siehe AGB)",
  "Hosting, Wartung, SSL-Zertifikat und technischer Support inklusive",
  "Kündigung zum Ende der Mindestlaufzeit mit gesetzlicher Frist möglich",
  "Keine Einrichtungsgebühr, keine versteckten Kosten",
  "Vollständige Vertragsbedingungen in unseren AGB",
];

const faqs = [
  { q: "Ist das 1€-Angebot seriös? Wo ist der Haken?", a: "Kein Haken. Wir nutzen den ersten Monat als Einführungsangebot, damit Sie unsere Arbeit risikoarm testen können. Ab Monat 2 gilt der reguläre Preis von 59 €/Monat bei 12 Monaten Mindestlaufzeit — transparent in unseren AGB festgehalten." },
  { q: "Was ist im monatlichen Preis enthalten?", a: "Hosting, SSL-Zertifikat, technische Wartung, Updates und Support. Sie müssen sich um nichts Technisches kümmern — wir übernehmen das vollständig." },
  { q: "Kann ich vorzeitig kündigen?", a: "Das Mietmodell hat eine Mindestlaufzeit von 12 Monaten, danach ist eine Kündigung mit gesetzlicher Frist möglich. Details finden Sie in unseren AGB." },
  { q: "Was passiert mit meiner Webseite nach den 12 Monaten?", a: "Sie läuft einfach weiter — keine Aktion nötig. Sie können jederzeit kündigen, upgraden oder mit uns über andere Optionen sprechen." },
  { q: "Gibt es versteckte Kosten?", a: "Nein. 1 € im ersten Monat, danach 59 €/Monat — das ist der vollständige Preis. Keine Einrichtungsgebühr, keine Zusatzkosten für Hosting oder Wartung." },
];

const EinEuroAngebot = () => {
  const [form, setForm] = useState({ name: "", firma: "", email: "", telefon: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "1€ Angebot: Neue Webseite im ersten Monat für 1 € | Meine Traum Webseite";
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.firma.trim()) {
      setError("Bitte Name, Firma und E-Mail angeben.");
      return;
    }
    setSubmitting(true);
    const result = await submitVorschauAnfrage({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.firma.trim(),
      website_url: null,
      phone: form.telefon.trim() || null,
      source_page: "/1euro-angebot",
    });
    setSubmitting(false);
    if (!result.ok) {
      setError("Etwas ist schiefgelaufen. Bitte rufen Sie uns an: 06131 30 764 98");
      return;
    }
    setSubmitted(true);
    document.getElementById("angebot-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(115deg, hsl(250 56% 14%) 0%, hsl(250 56% 18%) 35%, hsl(228 30% 8%) 75%, hsl(228 30% 5%) 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 5% 15%, hsl(270 70% 55% / 0.45), transparent 65%), radial-gradient(ellipse 50% 50% at 30% 70%, hsl(215 100% 45% / 0.25), transparent 65%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm rounded-full px-4 py-1.5 mb-6">
            🎉 Zeitlich begrenztes Einführungsangebot
          </span>
          <h1 className="font-bold text-4xl md:text-6xl leading-tight mb-6">
            Ihre neue Webseite —<br />
            den ersten Monat für nur 1 €.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Professionelle Webseite, BFSG- und DSGVO-konform, in 2-4 Wochen umgesetzt.
            Danach 59 € im Monat — kündbar mit den üblichen Konditionen. Keine versteckten Kosten.
          </p>

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-end gap-6 mb-2">
              <span className="text-5xl md:text-6xl font-bold text-white/40 line-through">59 €</span>
              <span className="text-6xl md:text-7xl font-bold text-white">1 €</span>
            </div>
            <span className="text-white/60 text-xs tracking-widest uppercase">Erster Monat</span>
          </div>

          <button
            onClick={() => scrollTo("angebot-form")}
            className="bg-white font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-xl"
            style={{ color: "var(--brand-purple)" }}
          >
            Jetzt 1€-Angebot sichern →
          </button>
          <p className="text-white/60 text-sm mt-4">
            Danach 59 €/Monat. 12 Monate Mindestlaufzeit. Jederzeit einsehbare AGB.
          </p>
        </div>
      </section>

      {/* WAS IST ENTHALTEN */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Das bekommen Sie für 1 €
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {includes.map((i) => (
              <div key={i.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">{i.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{i.title}</h3>
                <p className="text-muted-foreground text-sm">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIE FUNKTIONIERT */}
      <section className="bg-muted/40 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">So funktioniert's</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: "var(--brand-purple)" }}
                >
                  {s.n}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENZ-BOX */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[700px] mx-auto px-4">
          <div className="rounded-2xl border-2 border-border p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Transparenz ist uns wichtig</h2>
            <ul className="space-y-3">
              {transparency.map((t) => (
                <li key={t} className="flex gap-3 items-start text-foreground">
                  <span className="font-bold mt-0.5" style={{ color: "var(--brand-purple)" }}>✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <a
                href="/agb"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: "var(--brand-purple)" }}
              >
                → Zu den AGB
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VERGLEICH */}
      <section
        className="py-20 md:py-24 text-white"
        style={{ background: "linear-gradient(135deg, hsl(228 24% 12%), hsl(250 56% 18%))" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Was würde das normalerweise kosten?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white bg-white p-6" style={{ color: "var(--brand-purple)" }}>
              <h3 className="font-semibold text-xl mb-4" style={{ color: "var(--brand-purple)" }}>Klassische Agentur</h3>
              <ul className="space-y-2">
                <li>Einrichtung: 1.500€ - 5.000€ einmalig</li>
                <li>Laufende Kosten: 80-150€/Monat</li>
                <li>Lange Wartezeiten</li>
              </ul>
            </div>
            <div
              className="rounded-2xl p-6 bg-white/10"
              style={{ border: "2px solid var(--brand-purple)" }}
            >
              <h3 className="font-bold text-xl mb-4 text-white">Unser Angebot</h3>
              <ul className="space-y-2 text-white">
                <li>Einrichtung: 1 € (statt 59 €)</li>
                <li>Danach: 59 €/Monat — alles inklusive</li>
                <li>Fertig in 2-4 Wochen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                <p className="text-foreground mb-4 italic">"{t.quote}"</p>
                <p className="text-sm font-semibold text-muted-foreground">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/40 py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FORM */}
      <section id="angebot-form" className="bg-white py-20 md:py-24">
        <div className="max-w-xl mx-auto px-4">
          <div className="rounded-2xl border border-border p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-center">Jetzt 1€-Angebot sichern</h2>
            <p className="text-muted-foreground text-center mb-6">
              Unverbindliches Kennenlerngespräch — wir melden uns innerhalb von 48 Stunden.
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Vielen Dank!</h3>
                <p className="text-muted-foreground">
                  Wir melden uns innerhalb von 48 Stunden bei Ihnen.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { k: "name", label: "Ihr Name", type: "text" },
                  { k: "firma", label: "Firmenname", type: "text" },
                  { k: "email", label: "E-Mail", type: "email" },
                  { k: "telefon", label: "Telefon (optional)", type: "tel" },
                ].map((f) => (
                  <div key={f.k}>
                    <Label htmlFor={f.k} className="mb-1.5 block">{f.label}</Label>
                    <Input
                      id={f.k}
                      type={f.type}
                      value={(form as Record<string, string>)[f.k]}
                      onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                    />
                  </div>
                ))}
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full text-white hover:opacity-90 font-semibold"
                  style={{ backgroundColor: "var(--brand-purple)" }}
                >
                  {submitting ? "Wird gesendet..." : "1€-Angebot anfordern →"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Mit dem Absenden akzeptieren Sie, dass wir Sie zur Angebotsbesprechung kontaktieren.
                  Es entstehen keine Verpflichtungen.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-20 md:py-24 text-white text-center"
        style={{
          background:
            "linear-gradient(115deg, hsl(250 56% 14%) 0%, hsl(250 56% 28%) 50%, hsl(228 30% 8%) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihre neue Webseite — für 1 €?
          </h2>
          <p className="text-white/70 mb-8">Limitiertes Einführungsangebot. Jetzt sichern.</p>
          <button
            onClick={() => scrollTo("angebot-form")}
            className="bg-white font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-xl"
            style={{ color: "var(--brand-purple)" }}
          >
            Jetzt 1€-Angebot sichern →
          </button>
        </div>
      </section>
    </div>
  );
};

export default EinEuroAngebot;