
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface StatusChartProps {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
}

const StatusChart: React.FC<StatusChartProps> = ({ 
  total, 
  active, 
  inactive, 
  maintenance 
}) => {
  const activePercent = Math.round((active / total) * 100);
  const inactivePercent = Math.round((inactive / total) * 100);
  const maintenancePercent = Math.round((maintenance / total) * 100);
  
  return (
    <div className="dashboard-card">
      <h3 className="font-semibold mb-4">Status das Usinas</h3>
      
      <div className="flex justify-between mb-2">
        <span className="text-sm text-dashboard-muted">Total de Instalações</span>
        <span className="font-bold">{total}</span>
      </div>
      
      <div className="space-y-4 mt-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Ativas</span>
            <span className="text-sm font-medium text-success">{active}</span>
          </div>
          <Progress value={activePercent} className="h-2 bg-gray-700">
            <div className="bg-success h-full" style={{width: `${activePercent}%`}}></div>
          </Progress>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Inativas</span>
            <span className="text-sm font-medium text-danger">{inactive}</span>
          </div>
          <Progress value={inactivePercent} className="h-2 bg-gray-700">
            <div className="bg-danger h-full" style={{width: `${inactivePercent}%`}}></div>
          </Progress>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Em manutenção</span>
            <span className="text-sm font-medium text-warning">{maintenance}</span>
          </div>
          <Progress value={maintenancePercent} className="h-2 bg-gray-700">
            <div className="bg-warning h-full" style={{width: `${maintenancePercent}%`}}></div>
          </Progress>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;
