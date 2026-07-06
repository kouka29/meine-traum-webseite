import { AnimatePresence } from "framer-motion";
import { FunnelProvider, useFunnel } from "./vorschau-start/state";
import { ProgressBar } from "./vorschau-start/ProgressBar";
import Step0Gratulation from "./vorschau-start/steps/Step0Gratulation";
import Step1Logo from "./vorschau-start/steps/Step1Logo";
import Step2Fragen from "./vorschau-start/steps/Step2Fragen";
import Step3Fotos from "./vorschau-start/steps/Step3Fotos";
import Step4Termin from "./vorschau-start/steps/Step4Termin";
import Step5Danke from "./vorschau-start/steps/Step5Danke";

function FunnelInner() {
  const { state } = useFunnel();

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-hero-bg pt-24 md:pt-28">
      {state.step >= 1 && state.step <= 4 && (
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <ProgressBar current={state.step} total={4} />
        </div>
      )}
      <AnimatePresence mode="wait">
        {state.step === 0 && <Step0Gratulation key="0" />}
        {state.step === 1 && <Step1Logo key="1" />}
        {state.step === 2 && <Step2Fragen key="2" />}
        {state.step === 3 && <Step3Fotos key="3" />}
        {state.step === 4 && <Step4Termin key="4" />}
        {state.step >= 5 && <Step5Danke key="5" />}
      </AnimatePresence>
    </div>
  );
}

export default function VorschauStart() {
  return (
    <FunnelProvider>
      <FunnelInner />
    </FunnelProvider>
  );
}
