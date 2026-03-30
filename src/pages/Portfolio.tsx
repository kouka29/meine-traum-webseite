import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Monitor, ExternalLink } from "lucide-react";

const projects = [
  { title: "TechStart GmbH", category: "SaaS Landing Page", desc: "Conversion-optimierte Landing Page mit modernem Design und klarer Nutzerführung.", gradient: "from-primary to-accent" },
  { title: "Yoga Studio Flow", category: "Branding & Webdesign", desc: "Ganzheitliches Branding und Webdesign für ein Premium-Yoga-Studio.", gradient: "from-accent to-primary" },
  { title: "DigitalBoost", category: "E-Commerce", desc: "Online-Shop mit intuitivem Design und optimiertem Checkout-Prozess.", gradient: "from-primary/80 to-accent/80" },
  { title: "Kanzlei Weber", category: "Corporate Website", desc: "Seriöse und vertrauenswürdige Online-Präsenz für eine Rechtsanwaltskanzlei.", gradient: "from-accent/90 to-primary/90" },
  { title: "FitLife Coaching", category: "Personal Brand", desc: "Persönliche Webseite mit integriertem Buchungssystem und Blog.", gradient: "from-primary to-accent/70" },
  { title: "GreenTech Solutions", category: "Startup Website", desc: "Innovatives Webdesign für ein Cleantech-Startup mit Investoren-Fokus.", gradient: "from-accent/70 to-primary" },
];

const Portfolio = () => (
  <main className="pt-16">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Portfolio
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Unsere <span className="gradient-text">Projekte</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Ausgewählte Arbeiten, die zeigen, was wir können.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.08}>
              <div className="group cursor-pointer rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}
                >
                  <Monitor size={48} className="text-primary-foreground/40" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                    <ExternalLink
                      size={24}
                      className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary">{p.category}</span>
                  <h3 className="font-heading font-semibold mt-1 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default Portfolio;
