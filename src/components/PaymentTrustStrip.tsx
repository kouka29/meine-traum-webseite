// Mini SVG payment method logos in muted-foreground color
export default function PaymentTrustStrip() {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-3">
      <div className="flex items-center gap-2 opacity-60">
        {/* Visa */}
        <svg viewBox="0 0 48 16" className="h-4 w-auto" fill="currentColor" aria-label="Visa">
          <text x="0" y="13" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" fontStyle="italic">VISA</text>
        </svg>
        {/* Mastercard */}
        <svg viewBox="0 0 36 22" className="h-4 w-auto" aria-label="Mastercard">
          <circle cx="13" cy="11" r="9" fill="currentColor" opacity="0.7" />
          <circle cx="23" cy="11" r="9" fill="currentColor" opacity="0.4" />
        </svg>
        {/* SEPA */}
        <svg viewBox="0 0 48 16" className="h-4 w-auto" fill="currentColor" aria-label="SEPA">
          <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">SEPA</text>
        </svg>
        {/* Klarna */}
        <svg viewBox="0 0 56 16" className="h-4 w-auto" fill="currentColor" aria-label="Klarna">
          <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">Klarna</text>
        </svg>
      </div>
      <p className="text-[11px] text-muted-foreground text-center leading-tight">
        50 % Anzahlung jetzt · Rest nach Go-Live per Rechnung
      </p>
    </div>
  );
}
