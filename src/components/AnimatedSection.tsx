import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Lightweight in-view fade/slide animation using IntersectionObserver + CSS.
 * Replaces the previous framer-motion implementation to keep the home page
 * free of the vendor-motion chunk (~20 KiB unused on first paint).
 */
const AnimatedSection = forwardRef<HTMLDivElement, Props>(
  ({ children, className, delay = 0 }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      if (typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setInView(true);
              obs.disconnect();
            }
          });
        },
        { rootMargin: "-50px" }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    const style: React.CSSProperties = {
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 600ms ease-out ${delay}s, transform 600ms ease-out ${delay}s`,
      willChange: "opacity, transform",
    };

    return (
      <div ref={innerRef} className={className} style={style}>
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
