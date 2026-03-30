import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const UrgencyBanner = () => (
  <div className="bg-destructive/8 border-y border-destructive/15 py-4">
    <div className="container-narrow px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
      <div className="flex items-center gap-2.5">
        <Clock size={16} className="text-destructive" />
        <span className="text-sm font-medium text-foreground">
          Jeden Tag ohne professionelle Website = verlorene Kunden.
        </span>
      </div>
      <Button variant="gradient" size="sm" className="text-xs" asChild>
        <Link to="/kontakt">
          Jetzt handeln <ArrowRight size={14} />
        </Link>
      </Button>
    </div>
  </div>
);

export default UrgencyBanner;
