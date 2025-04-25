import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/RMS2.png" alt="Logo" className="h-20 w-auto" />
      <div className="text-dashboard-highlight text-2xl font-bold">
      </div>
    </div>
  );
};

export default Logo;
