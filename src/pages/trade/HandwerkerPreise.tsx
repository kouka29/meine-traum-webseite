import WebdesignPreise from "@/pages/WebdesignPreise";
import { PricingNamesProvider } from "@/lib/pricingNames";

const tradeNames = {
  Starter: "Einzelkämpfer",
  Pro: "Wachstums-Betrieb",
  Premium: "Marktführer",
};

const HandwerkerPreise = () => (
  <PricingNamesProvider names={tradeNames}>
    <WebdesignPreise />
  </PricingNamesProvider>
);

export default HandwerkerPreise;
