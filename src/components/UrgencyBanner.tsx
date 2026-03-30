import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const UrgencyBanner = () => (
  <div className="bg-destructive/10 border-y border-destructive/20 py-4">
    <div className="container-narrow px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-destructive" />
        <span className="text-sm font-medium text-foreground">
          Jeden Tag ohne professionelle Website = verlorene Kunden.
        </span>
      </div>
      <Button variant="gradient" size="sm" asChild>
        <Link to="/kontakt">
          Jetzt handeln <ArrowRight size={14} />
        </Link>
      </Button>
    </div>
  </div>
);

export default UrgencyBanner;
