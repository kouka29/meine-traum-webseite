interface DeviceMockupProps {
  desktopUrl: string;
  title: string;
}

const DeviceMockup = ({ desktopUrl, title }: DeviceMockupProps) => {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Laptop */}
      <div className="relative w-full max-w-full">
        {/* Screen bezel */}
        <div className="bg-[#2a2a2a] rounded-t-[8px] p-[6px] pb-0">
          {/* Webcam dot */}
          <div className="flex justify-center mb-[3px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-[#333]" />
          </div>
          {/* Screen */}
          <div className="bg-muted overflow-hidden rounded-sm">
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
    </div>
  );
};

export default DeviceMockup;
