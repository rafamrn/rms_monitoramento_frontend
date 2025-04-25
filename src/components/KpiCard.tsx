
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, icon }) => {
  return (
    <div className="dashboard-card flex items-start">
      <div className="mr-3 bg-primary/10 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-dashboard-muted text-sm">{title}</p>
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold">{value}</h3>
          <span className="ml-1 text-dashboard-muted text-sm">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
