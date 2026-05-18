import { AlertTriangle, LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
}

const PainPointCard = ({ icon: Icon = AlertTriangle, title, description }: Props) => (
  <div className="rounded-2xl border border-white/5 p-6 flex flex-col gap-3" style={{ background: "#1A1D2E" }}>
    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
      <Icon size={22} />
    </div>
    <h3 className="text-base font-semibold text-white">{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{description}</p>
  </div>
);

export default PainPointCard;
