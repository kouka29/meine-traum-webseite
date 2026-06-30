import { AlertTriangle, LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
}

const PainPointCard = ({ icon: Icon = AlertTriangle, title, description }: Props) => (
  <div className="rounded-card border border-white/5 bg-surface-dark-card p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-warning/15 text-warning">
      <Icon size={22} aria-hidden focusable={false} />
    </div>
    <h3 className="text-base font-semibold text-white">{title}</h3>
    <p className="text-sm leading-relaxed text-on-dark-muted">{description}</p>
  </div>
);

export default PainPointCard;
