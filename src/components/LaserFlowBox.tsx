import React from 'react';

type LaserFlowBoxProps = {
  className?: string;
  children?: React.ReactNode;
};

const LaserFlowBox: React.FC<LaserFlowBoxProps> = ({ className = '', children }) => {
  return (
    <div className={`laser-flow relative overflow-hidden rounded-2xl border border-white/15 bg-black/60 backdrop-blur-sm ${className}`}>
      {/* Content layer */}
      <div className="relative z-[1] h-full w-full flex items-center justify-center text-white text-sm">
        {children}
      </div>
    </div>
  );
};

export default LaserFlowBox;


