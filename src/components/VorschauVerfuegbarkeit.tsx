import { useEffect, useState } from "react";
import { checkVorschauAvailability, type Availability } from "@/lib/vorschauSlots";

type Variant = "light" | "dark";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * Small pill showing how many free preview slots are left this month.
 * Fails gracefully — renders nothing if the availability check errors.
 */
const VorschauVerfuegbarkeit = ({ variant = "light", className = "" }: Props) => {
  const [data, setData] = useState<Availability | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    checkVorschauAvailability().then((res) => {
      if (!active) return;
      setData(res);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!loaded || !data) return null;

  const isFull = data.isFull;

  const palette = (() => {
    if (variant === "dark") {
      return isFull
        ? {
            wrap: "bg-amber-500/10 border-amber-500/20 text-amber-400",
            dot: "bg-amber-400",
          }
        : {
            wrap: "bg-green-500/10 border-green-500/20 text-green-400",
            dot: "bg-green-400",
          };
    }
    return isFull
      ? {
          wrap: "bg-amber-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
        }
      : {
          wrap: "bg-green-50 border-green-200 text-green-700",
          dot: "bg-green-500",
        };
  })();

  const text = isFull
    ? `Alle ${data.total} Plätze diesen Monat vergeben — jetzt für Warteliste eintragen`
    : `Noch ${data.available} von ${data.total} Plätzen frei diesen Monat`;

  return (
    <div
      className={`inline-flex items-center gap-2 text-sm border rounded-full px-3 py-1 ${palette.wrap} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`inline-block w-2 h-2 rounded-full animate-pulse ${palette.dot}`}
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  );
};

export default VorschauVerfuegbarkeit;