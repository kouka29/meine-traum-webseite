import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "150+", label: "Webseiten umgesetzt" },
  { value: "2–5x", label: "Mehr Anfragen nach Relaunch" },
  { value: "98%", label: "Weiterempfehlungsrate" },
  { value: "48 h", label: "Erstes Konzept steht" },
];

const SocialProofBar = () => (
 <section className="py-16 border-y border-border/50 bg-card/50">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s) => (
 <div key={s.label}>
              <p className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default SocialProofBar;
