import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "150+", label: "Zufriedene Kunden" },
  { value: "3x", label: "Mehr Anfragen im Schnitt" },
  { value: "98%", label: "Weiterempfehlungsrate" },
  { value: "<3 Sek.", label: "Ladezeit garantiert" },
];

const SocialProofBar = () => (
  <section className="py-12 border-y border-border">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl md:text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default SocialProofBar;
