
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  time: string;
}

interface AlertsWidgetProps {
  alerts: Alert[];
}

const AlertsWidget: React.FC<AlertsWidgetProps> = ({ alerts }) => {
  const getAlertIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <div className="w-3 h-3 rounded-full bg-danger"></div>;
      case 'warning':
        return <div className="w-3 h-3 rounded-full bg-warning"></div>;
      case 'info':
        return <div className="w-3 h-3 rounded-full bg-info"></div>;
    }
  };

  return (
    <Card className="bg-dashboard-card border-gray-800">
      <CardHeader>
        <CardTitle>Alertas ativos</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            Nenhum alerta ativo
          </div>
        ) : (
          <ul className="space-y-3">
            {alerts.map(alert => (
              <li key={alert.id} className="flex items-start space-x-3 p-3 rounded-md bg-gray-800">
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsWidget;
