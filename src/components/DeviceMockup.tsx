interface DeviceMockupProps {
  desktopUrl: string;
  mobileUrl: string;
  title: string;
}

const DeviceMockup = ({ desktopUrl, mobileUrl, title }: DeviceMockupProps) => {
  return (
    <div className="relative w-full h-full flex items-end">
      {/* Laptop */}
      <div className="relative w-[75%]">
        {/* Screen bezel */}
        <div className="bg-[#2a2a2a] rounded-t-[8px] p-[6px] pb-0">
          {/* Webcam dot */}
          <div className="flex justify-center mb-[3px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-[#333]" />
          </div>
          {/* Screen */}
          <div className="bg-muted overflow-hidden rounded-[2px]">
            <img
              src={desktopUrl}
              alt={`${title} – Desktop Ansicht`}
              loading="lazy"
              className="w-full h-auto block"
            />
          </div>
        </div>
        {/* Laptop hinge */}
        <div className="h-[4px] bg-[#3a3a3a] rounded-b-sm" />
        {/* Laptop base/keyboard */}
        <div className="h-[8px] bg-gradient-to-b from-[#d1d1d1] to-[#b8b8b8] rounded-b-[6px] mx-[-4%] relative shadow-sm">
          <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[15%] h-[3px] bg-[#a0a0a0] rounded-full" />
        </div>
      </div>

      {/* iPhone */}
      {mobileUrl && (
        <div className="absolute bottom-0 right-0 w-[28%] z-10" style={{ height: '85%' }}>
          <div className="bg-[#1a1a1a] rounded-[16px] p-[4px] shadow-elevated border border-[#333] h-full flex flex-col">
            <div className="bg-background rounded-[13px] overflow-hidden relative flex-1 min-h-0">
              {/* Dynamic Island */}
              <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[35%] h-[10px] bg-[#1a1a1a] rounded-full z-10" />
              {/* Screen content */}
              <img
                src={mobileUrl}
                alt={`${title} – iPhone Ansicht`}
                loading="lazy"
                className="w-full h-full object-cover object-top block"
              />
              {/* Home indicator */}
              <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-foreground/30 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceMockup;
