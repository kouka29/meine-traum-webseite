import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GlobalCtaPopup from "@/components/GlobalCtaPopup";
import ScrollToTop from "@/components/ScrollToTop";
import PageMeta from "@/components/PageMeta";
import StructuredData from "@/components/StructuredData";
import PageTracker from "@/components/PageTracker";
import { DesignModeProvider, useDesignMode } from "@/contexts/DesignModeProvider";

// Eager load Index for fastest initial paint
import Index from "./pages/Index.tsx";

// Lazy load all other pages
const Services = lazy(() => import("./pages/Services.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Datenschutz = lazy(() => import("./pages/Datenschutz.tsx"));
const Impressum = lazy(() => import("./pages/Impressum.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminLeads = lazy(() => import("./pages/AdminLeads.tsx"));
const WebdesignAgentur = lazy(() => import("./pages/WebdesignAgentur.tsx"));
const WebsiteErstellenLassen = lazy(() => import("./pages/WebsiteErstellenLassen.tsx"));
const LandingpageErstellen = lazy(() => import("./pages/LandingpageErstellen.tsx"));
const WebsiteRelaunch = lazy(() => import("./pages/WebsiteRelaunch.tsx"));
const ConversionOptimierung = lazy(() => import("./pages/ConversionOptimierung.tsx"));
const KostenloserWebsiteCheck = lazy(() => import("./pages/KostenloserWebsiteCheck.tsx"));
const WebdesignPreise = lazy(() => import("./pages/WebdesignPreise.tsx"));
const WebdesignPreise2 = lazy(() => import("./pages/WebdesignPreise2.tsx"));
const WebdesignSHK = lazy(() => import("./pages/WebdesignSHK.tsx"));
const WebdesignHandwerker = lazy(() => import("./pages/WebdesignHandwerker.tsx"));
const WebdesignAerzte = lazy(() => import("./pages/WebdesignAerzte.tsx"));
const WebdesignImmobilienmakler = lazy(() => import("./pages/WebdesignImmobilienmakler.tsx"));
const WebdesignCoaches = lazy(() => import("./pages/WebdesignCoaches.tsx"));
const IndividuelleSoftware = lazy(() => import("./pages/IndividuelleSoftware.tsx"));
const IndexOriginal = lazy(() => import("./pages/IndexOriginal.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const KostenloseVorschau = lazy(() => import("./pages/KostenloseVorschau.tsx"));
const KostenloseVorschau2 = lazy(() => import("./pages/KostenloseVorschau2.tsx"));
const KostenloseVorschauV2 = lazy(() => import("./pages/KostenloseVorschauV2.tsx"));
const Empfehlung = lazy(() => import("./pages/Empfehlung.tsx"));
const Erstgespraech = lazy(() => import("./pages/Erstgespraech.tsx"));
const Starter = lazy(() => import("./pages/Starter.tsx"));
const KaufErfolgreich = lazy(() => import("./pages/KaufErfolgreich.tsx"));
const Handwerker = lazy(() => import("./pages/Handwerker.tsx"));
const HandwerkerClassic = lazy(() => import("./pages/HandwerkerClassic.tsx"));
const HandwerkerPreise = lazy(() => import("./pages/trade/HandwerkerPreise.tsx"));
const HandwerkerLeistungen = lazy(() => import("./pages/trade/HandwerkerLeistungen.tsx"));
const HandwerkerPortfolio = lazy(() => import("./pages/trade/HandwerkerPortfolio.tsx"));
const HandwerkerUeberUns = lazy(() => import("./pages/trade/HandwerkerUeberUns.tsx"));
const HandwerkerKontakt = lazy(() => import("./pages/trade/HandwerkerKontakt.tsx"));
const ElektrikerHub = lazy(() => import("./pages/trade/ElektrikerHub.tsx"));
const MalerHub = lazy(() => import("./pages/trade/MalerHub.tsx"));
const SanitaerHub = lazy(() => import("./pages/trade/SanitaerHub.tsx"));
const DachdeckerHub = lazy(() => import("./pages/trade/DachdeckerHub.tsx"));
const ElektrikerPreise = lazy(() => import("./pages/trade/ElektrikerPreise.tsx"));
const SanitaerPreise = lazy(() => import("./pages/trade/SanitaerPreise.tsx"));
const DachdeckerPreise = lazy(() => import("./pages/trade/DachdeckerPreise.tsx"));
const Angebot = lazy(() => import("./pages/Angebot.tsx"));
const AGB = lazy(() => import("./pages/AGB.tsx"));
const ZahlungErfolgreich = lazy(() => import("./pages/ZahlungErfolgreich.tsx"));
const KundenportalLogin = lazy(() => import("./pages/kundenportal/Login.tsx"));
const KundenportalResetPassword = lazy(() => import("./pages/kundenportal/ResetPassword.tsx"));
const KundenportalLayout = lazy(() => import("./pages/kundenportal/Layout.tsx"));
const KundenportalDashboard = lazy(() => import("./pages/kundenportal/Dashboard.tsx"));
const KundenportalVertrag = lazy(() => import("./pages/kundenportal/Vertrag.tsx"));
const KundenportalRechnungen = lazy(() => import("./pages/kundenportal/Rechnungen.tsx"));
const KundenportalTickets = lazy(() => import("./pages/kundenportal/Tickets.tsx"));
const KundenportalTicketDetail = lazy(() => import("./pages/kundenportal/TicketDetail.tsx"));
const KundenportalAngebote = lazy(() => import("./pages/kundenportal/Angebote.tsx"));
const KundenportalEinstellungen = lazy(() => import("./pages/kundenportal/Einstellungen.tsx"));
const KundenportalWachstumspaket = lazy(() => import("./pages/kundenportal/Wachstumspaket.tsx"));
const EmailAngebot = lazy(() => import("./pages/lp/EmailAngebot.tsx"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const HandwerkerRoute = () => {
  const { appleDesign } = useDesignMode();
  return appleDesign ? <Handwerker /> : <HandwerkerClassic />;
};

const ChromeWrapper = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const standalone =
    pathname === "/angebot" ||
    pathname === "/a" ||
    pathname.startsWith("/a/") ||
    pathname === "/agb" ||
    pathname.startsWith("/lp/") ||
    pathname.startsWith("/kundenportal");
  return (
    <>
      {!standalone && <Navbar />}
      {children}
      {!standalone && <Footer />}
      <CookieBanner />
      {!standalone && <GlobalCtaPopup />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DesignModeProvider>
          <ScrollToTop />
          <PageMeta />
          <StructuredData />
          <PageTracker />
          <ChromeWrapper>
            <Suspense fallback={<PageLoader />}>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leistungen" element={<Services />} />
            <Route path="/ueber-uns" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/webdesign-agentur" element={<WebdesignAgentur />} />
            <Route path="/website-erstellen-lassen" element={<WebsiteErstellenLassen />} />
            <Route path="/landingpage-erstellen-lassen" element={<LandingpageErstellen />} />
            <Route path="/website-relaunch" element={<WebsiteRelaunch />} />
            <Route path="/conversion-optimierung" element={<ConversionOptimierung />} />
            <Route path="/kostenloser-website-check" element={<KostenloserWebsiteCheck />} />
            <Route path="/kostenlose-vorschau" element={<KostenloseVorschauV2 />} />
            <Route path="/kostenlose-vorschau-v2" element={<KostenloseVorschau2 />} />
            <Route path="/kostenlose-vorschau2" element={<KostenloseVorschau />} />
            <Route path="/webdesign-preise" element={<WebdesignPreise />} />
            <Route path="/preise" element={<WebdesignPreise />} />
            <Route path="/preise2" element={<WebdesignPreise2 />} />
            <Route path="/webdesign-shk" element={<WebdesignSHK />} />
            <Route path="/webdesign-handwerker" element={<WebdesignHandwerker />} />
            <Route path="/webdesign-aerzte" element={<WebdesignAerzte />} />
            <Route path="/webdesign-immobilienmakler" element={<WebdesignImmobilienmakler />} />
            <Route path="/webdesign-coaches" element={<WebdesignCoaches />} />
            <Route path="/individuelle-software" element={<IndividuelleSoftware />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/admin" element={<AdminLeads />} />
            <Route path="/original" element={<IndexOriginal />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/empfehlung" element={<Empfehlung />} />
            <Route path="/erstgespraech" element={<Erstgespraech />} />
            <Route path="/starter" element={<Starter />} />
            <Route path="/kauf-erfolgreich" element={<KaufErfolgreich />} />
            <Route path="/handwerker" element={<HandwerkerRoute />} />
            <Route path="/handwerker/preise" element={<HandwerkerPreise />} />
            <Route path="/handwerker/leistungen" element={<HandwerkerLeistungen />} />
            <Route path="/handwerker/portfolio" element={<HandwerkerPortfolio />} />
            <Route path="/handwerker/ueber-uns" element={<HandwerkerUeberUns />} />
            <Route path="/handwerker/kontakt" element={<HandwerkerKontakt />} />
            <Route path="/handwerker/*" element={<Navigate to="/handwerker" replace />} />

            <Route path="/elektriker" element={<ElektrikerHub />} />
            <Route path="/elektriker/preise" element={<ElektrikerPreise />} />
            <Route path="/elektriker/leistungen" element={<Navigate to="/handwerker/leistungen" replace />} />
            <Route path="/elektriker/portfolio" element={<Navigate to="/handwerker/portfolio" replace />} />
            <Route path="/elektriker/ueber-uns" element={<Navigate to="/handwerker/ueber-uns" replace />} />
            <Route path="/elektriker/kontakt" element={<Navigate to="/handwerker/kontakt" replace />} />
            <Route path="/elektriker/*" element={<Navigate to="/elektriker" replace />} />

            <Route path="/maler" element={<MalerHub />} />
            <Route path="/maler/preise" element={<Navigate to="/handwerker/preise" replace />} />
            <Route path="/maler/leistungen" element={<Navigate to="/handwerker/leistungen" replace />} />
            <Route path="/maler/portfolio" element={<Navigate to="/handwerker/portfolio" replace />} />
            <Route path="/maler/ueber-uns" element={<Navigate to="/handwerker/ueber-uns" replace />} />
            <Route path="/maler/kontakt" element={<Navigate to="/handwerker/kontakt" replace />} />
            <Route path="/maler/*" element={<Navigate to="/maler" replace />} />

            <Route path="/sanitaer" element={<SanitaerHub />} />
            <Route path="/sanitaer/preise" element={<SanitaerPreise />} />
            <Route path="/sanitaer/leistungen" element={<Navigate to="/handwerker/leistungen" replace />} />
            <Route path="/sanitaer/portfolio" element={<Navigate to="/handwerker/portfolio" replace />} />
            <Route path="/sanitaer/ueber-uns" element={<Navigate to="/handwerker/ueber-uns" replace />} />
            <Route path="/sanitaer/kontakt" element={<Navigate to="/handwerker/kontakt" replace />} />
            <Route path="/sanitaer/*" element={<Navigate to="/sanitaer" replace />} />

            <Route path="/dachdecker" element={<DachdeckerHub />} />
            <Route path="/dachdecker/preise" element={<DachdeckerPreise />} />
            <Route path="/dachdecker/leistungen" element={<Navigate to="/handwerker/leistungen" replace />} />
            <Route path="/dachdecker/portfolio" element={<Navigate to="/handwerker/portfolio" replace />} />
            <Route path="/dachdecker/ueber-uns" element={<Navigate to="/handwerker/ueber-uns" replace />} />
            <Route path="/dachdecker/kontakt" element={<Navigate to="/handwerker/kontakt" replace />} />
            <Route path="/dachdecker/*" element={<Navigate to="/dachdecker" replace />} />
            <Route path="/angebot" element={<Angebot />} />
            <Route path="/a" element={<Angebot />} />
            <Route path="/a/:shortId" element={<Angebot />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/zahlung-erfolgreich" element={<ZahlungErfolgreich />} />
            <Route path="/lp/angebot" element={<EmailAngebot />} />
            <Route path="/kundenportal/login" element={<KundenportalLogin />} />
            <Route path="/kundenportal/passwort-zuruecksetzen" element={<KundenportalResetPassword />} />
            <Route path="/kundenportal" element={<KundenportalLayout />}>
              <Route index element={<KundenportalDashboard />} />
              <Route path="vertrag" element={<KundenportalVertrag />} />
              <Route path="wachstumspaket" element={<KundenportalWachstumspaket />} />
              <Route path="rechnungen" element={<KundenportalRechnungen />} />
              <Route path="wuensche" element={<KundenportalTickets />} />
              <Route path="wuensche/:id" element={<KundenportalTicketDetail />} />
              <Route path="angebote" element={<KundenportalAngebote />} />
              <Route path="einstellungen" element={<KundenportalEinstellungen />} />
            </Route>
            <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ChromeWrapper>
        </DesignModeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
