import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ScrollToTop from "@/components/ScrollToTop";
import PageMeta from "@/components/PageMeta";
import StructuredData from "@/components/StructuredData";
import PageTracker from "@/components/PageTracker";

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

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageMeta />
        <StructuredData />
        <PageTracker />
        <Navbar />
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
            <Route path="/kostenlose-vorschau" element={<KostenloseVorschau2 />} />
            <Route path="/kostenlose-vorschau2" element={<KostenloseVorschau />} />
            <Route path="/webdesign-preise" element={<WebdesignPreise />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
        <CookieBanner />
        <LeadCaptureModal />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
