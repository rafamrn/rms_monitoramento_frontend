
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  time: string;
  value: number;
}

interface AccelerometerChartProps {
  data: DataPoint[];
  currentPower: number;
  maxPower: number;
}

const AccelerometerChart: React.FC<AccelerometerChartProps> = ({ 
  data, 
  currentPower, 
  maxPower 
}) => {
  return (
    <Card className="bg-dashboard-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Potência Instantânea</span>
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl animate-pulse-slow">{currentPower}</span>
            <span className="text-sm text-gray-400">kW</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#9F9EA1' }} 
              axisLine={{ stroke: '#444' }}
            />
            <YAxis 
              tick={{ fill: '#9F9EA1' }} 
              axisLine={{ stroke: '#444' }}
              domain={[0, maxPower * 1.1]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#222', 
                borderColor: '#444',
                color: '#fff'
              }} 
            />
            <ReferenceLine 
              y={currentPower} 
              stroke="#FF4500" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Atual', 
                position: 'insideTopRight', 
                fill: '#FF4500' 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1EAEDB" 
              fillOpacity={1} 
              fill="url(#colorPower)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AccelerometerChart;
