
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface PerformanceBarProps {
  value: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ value }) => {
  // Determine color based on value
  const getColor = () => {
    if (value < 30) return "bg-danger";
    if (value < 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="h-3 flex-1 bg-gray-700">
        <div className={`${getColor()} h-full rounded-full`} style={{ width: `${value}%` }}></div>
      </Progress>
      <span className="text-sm font-medium w-9">{value}%</span>
    </div>
  );
};

export default PerformanceBar;
