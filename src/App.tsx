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
import PageTracker from "@/components/PageTracker";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import About from "./pages/About.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Contact from "./pages/Contact.tsx";
import Datenschutz from "./pages/Datenschutz.tsx";
import Impressum from "./pages/Impressum.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLeads from "./pages/AdminLeads.tsx";
import WebdesignAgentur from "./pages/WebdesignAgentur.tsx";
import WebsiteErstellenLassen from "./pages/WebsiteErstellenLassen.tsx";
import LandingpageErstellen from "./pages/LandingpageErstellen.tsx";
import WebsiteRelaunch from "./pages/WebsiteRelaunch.tsx";
import ConversionOptimierung from "./pages/ConversionOptimierung.tsx";
import KostenloserWebsiteCheck from "./pages/KostenloserWebsiteCheck.tsx";
import WebdesignPreise from "./pages/WebdesignPreise.tsx";
import WebdesignSHK from "./pages/WebdesignSHK.tsx";
import WebdesignHandwerker from "./pages/WebdesignHandwerker.tsx";
import WebdesignAerzte from "./pages/WebdesignAerzte.tsx";
import WebdesignImmobilienmakler from "./pages/WebdesignImmobilienmakler.tsx";
import WebdesignCoaches from "./pages/WebdesignCoaches.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageMeta />
        <PageTracker />
        <Navbar />
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
          <Route path="/webdesign-preise" element={<WebdesignPreise />} />
          <Route path="/webdesign-shk" element={<WebdesignSHK />} />
          <Route path="/webdesign-handwerker" element={<WebdesignHandwerker />} />
          <Route path="/webdesign-aerzte" element={<WebdesignAerzte />} />
          <Route path="/webdesign-immobilienmakler" element={<WebdesignImmobilienmakler />} />
          <Route path="/webdesign-coaches" element={<WebdesignCoaches />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/admin" element={<AdminLeads />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <CookieBanner />
        <LeadCaptureModal />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
