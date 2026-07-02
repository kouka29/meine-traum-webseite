import WebdesignPreise from "@/pages/WebdesignPreise";
import { PricingNamesProvider } from "@/lib/pricingNames";

const tradeNames = {
  Starter: "Einzelkämpfer",
  Pro: "Wachstums-Betrieb",
  Premium: "Marktführer",
};

const DachdeckerPreise = () => (
 <PricingNamesProvider names={tradeNames}>
    <WebdesignPreise />
  </PricingNamesProvider>
);

export default DachdeckerPreise;
