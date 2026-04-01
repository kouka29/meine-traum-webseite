interface DeviceMockupProps {
  desktopUrl: string;
  mobileUrl: string;
  title: string;
}

const DeviceMockup = ({ desktopUrl, mobileUrl, title }: DeviceMockupProps) => {
  return (
    <div className="relative w-full">
      {/* Laptop Frame */}
      <div className="relative">
        {/* Screen */}
        <div className="bg-muted rounded-t-lg border-[3px] border-foreground/20 border-b-0 overflow-hidden">
          {/* Title bar */}
          <div className="bg-foreground/10 px-3 py-1.5 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <img
            src={desktopUrl}
            alt={`${title} – Desktop Ansicht`}
            loading="lazy"
            className="w-full h-auto block"
          />
        </div>
        {/* Laptop base */}
        <div className="h-3 bg-foreground/15 rounded-b-lg mx-[-2%] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/5 h-1 bg-foreground/10 rounded-b" />
        </div>
      </div>

      {/* Phone Frame - positioned bottom-right overlapping */}
      {mobileUrl && (
        <div className="absolute -bottom-2 -right-2 w-[28%] z-10">
          <div className="bg-foreground/20 rounded-[12px] p-[3px] shadow-elevated">
            <div className="bg-background rounded-[10px] overflow-hidden">
              {/* Phone notch */}
              <div className="bg-foreground/10 h-3 flex items-center justify-center">
                <div className="w-8 h-1 bg-foreground/20 rounded-full" />
              </div>
              <img
                src={mobileUrl}
                alt={`${title} – Mobile Ansicht`}
                loading="lazy"
                className="w-full h-auto block"
              />
              {/* Phone bottom bar */}
              <div className="bg-foreground/10 h-3 flex items-center justify-center">
                <div className="w-6 h-1 bg-foreground/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceMockup;
