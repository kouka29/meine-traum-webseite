import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "mtw_funnel_v1";

export type Stil = "hell-modern" | "dunkel-edel" | "logo-angepasst" | "ueberrascht";
export type Ziel = "mehr-anfragen" | "professioneller" | "mitarbeiter" | "google";
export type Kontaktart = "phone" | "video";

export interface FunnelState {
  funnelUuid: string;
  step: number;
  fragenIndex: number;

  // Logo
  logoUrl: string | null;
  logoName: string | null;
  keinLogo: boolean;

  // Fragen
  firmenname: string;
  ort: string;
  gewerk: string;
  leistungen: string;
  hatWebsite: boolean | null;
  websiteUrl: string;
  stil: Stil | null;
  ziel: Ziel | null;

  // Fotos
  fotos: { url: string; name: string }[];

  // Termin
  terminDatum: string | null; // YYYY-MM-DD
  terminUhrzeit: string | null;
  kontaktart: Kontaktart | null;
  name: string;
  telefon: string;
  email: string;
  datenschutz: boolean;
}

const initial = (): FunnelState => ({
  funnelUuid: crypto.randomUUID(),
  step: 0,
  fragenIndex: 0,
  logoUrl: null,
  logoName: null,
  keinLogo: false,
  firmenname: "",
  ort: "",
  gewerk: "",
  leistungen: "",
  hatWebsite: null,
  websiteUrl: "",
  stil: null,
  ziel: null,
  fotos: [],
  terminDatum: null,
  terminUhrzeit: null,
  kontaktart: null,
  name: "",
  telefon: "",
  email: "",
  datenschutz: false,
});

interface Ctx {
  state: FunnelState;
  patch: (p: Partial<FunnelState>) => void;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

const FunnelCtx = createContext<Ctx | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>(() => {
    if (typeof window === "undefined") return initial();
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...initial(), ...parsed };
      }
    } catch {
      /* ignore */
    }
    return initial();
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const patch = useCallback((p: Partial<FunnelState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const next = useCallback(() => setState((s) => ({ ...s, step: s.step + 1 })), []);
  const back = useCallback(
    () => setState((s) => ({ ...s, step: Math.max(0, s.step - 1) })),
    [],
  );
  const goTo = useCallback((step: number) => setState((s) => ({ ...s, step })), []);
  const reset = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(initial());
  }, []);

  const value = useMemo<Ctx>(() => ({ state, patch, next, back, goTo, reset }), [
    state,
    patch,
    next,
    back,
    goTo,
    reset,
  ]);

  return <FunnelCtx.Provider value={value}>{children}</FunnelCtx.Provider>;
}

export function useFunnel() {
  const ctx = useContext(FunnelCtx);
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider");
  return ctx;
}
