import { Link, useLocation } from "react-router-dom";
import { getTradeContext, SUBPAGE_LABELS } from "@/lib/tradeContext";

const TradeBreadcrumbs = () => {
  const { pathname } = useLocation();
  const trade = getTradeContext(pathname);
  if (!trade) return null;

  const segs = pathname.split("/").filter(Boolean);
  const sub = segs[1];
  const subLabel = sub ? SUBPAGE_LABELS[sub] : null;

  return (
    <nav aria-label="Breadcrumb" className="container-narrow px-4 pt-4 text-xs sm:text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="hover:text-foreground transition-colors">Hauptseite</Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          {subLabel ? (
            <Link to={trade.hubPath} className="hover:text-foreground transition-colors">{trade.hubLabel}</Link>
 ) : (
 <span className="text-foreground/80 font-medium">{trade.hubLabel}</span>
          )}
        </li>
        {subLabel && (
          <>
            <li aria-hidden>›</li>
            <li className="text-foreground/80 font-medium">{subLabel}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default TradeBreadcrumbs;
