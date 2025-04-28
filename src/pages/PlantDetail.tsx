
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AccelerometerChart from '@/components/AccelerometerChart';
import KpiCard from '@/components/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Zap, BarChart, Clock } from 'lucide-react';
import { Plant } from '@/components/PlantTable';

// Sample data - in a real application, this would come from an API
const plantsData: Record<string, Plant> = {
  '1': {
    id: '1',
    name: 'Usina Solar Roda Pilão',
    location: 'Brasil',
    status: 'active',
    capacity: 22.4,
    currentPower: 20.0,
    dailyEnergy: 63.93,
    totalEnergy: 29420.84,
    performance: 89
  },
  '2': {
    id: '2',
    name: 'Usina Solar Cerrado',
    location: 'Brasil',
    status: 'active',
    capacity: 15.6,
    currentPower: 12.8,
    dailyEnergy: 42.15,
    totalEnergy: 18540.32,
    performance: 75
  },
  '3': {
    id: '3',
    name: 'Usina Solar Praça Nova',
    location: 'Brasil',
    status: 'maintenance',
    capacity: 18.2,
    currentPower: 0.0,
    dailyEnergy: 0.0,
    totalEnergy: 22680.56,
    performance: 0
  },
  '4': {
    id: '4',
    name: 'Usina Solar Santa Luzia',
    location: 'Brasil',
    status: 'inactive',
    capacity: 10.8,
    currentPower: 0.0,
    dailyEnergy: 0.0,
    totalEnergy: 12450.21,
    performance: 0
  },
  '5': {
    id: '5',
    name: 'Usina Solar Bom Jardim',
    location: 'Brasil',
    status: 'active',
    capacity: 25.6,
    currentPower: 22.5,
    dailyEnergy: 82.1,
    totalEnergy: 31260.45,
    performance: 95
  }
};

// Generate accelerometer data
const generateAccelerometerData = (hours: number, maxPower: number, currentPower: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < hours * 12; i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - (hours * 60) + (i * 5));
    
    // Generate a value that trends toward the current power
    const progress = i / (hours * 12);
    const randomFactor = Math.random() * 0.2 - 0.1; // -10% to +10%
    const baseValue = maxPower * 0.8 * Math.sin((i / (hours * 12)) * Math.PI) + maxPower * 0.1;
    let value = baseValue * (1 + randomFactor);
    
    // Trend toward current value near the end
    if (progress > 0.8) {
      const weight = (progress - 0.8) * 5; // 0 to 1 over the last 20%
      value = value * (1 - weight) + currentPower * weight;
    }
    
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      value: Number(value.toFixed(2))
    });
  }
  
  return data;
};

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [accelerometerData, setAccelerometerData] = useState<{ time: string, value: number }[]>([]);
  
  useEffect(() => {
    if (id && plantsData[id]) {
      setPlant(plantsData[id]);
      
      // Generate accelerometer data for the chart
      const data = generateAccelerometerData(6, plantsData[id].capacity, plantsData[id].currentPower);
      setAccelerometerData(data);
    }
  }, [id]);
  
  if (!plant) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  const getStatusText = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'maintenance':
        return 'Em Manutenção';
    }
  };
  
  const getStatusColor = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'inactive':
        return 'text-danger';
      case 'maintenance':
        return 'text-warning';
    }
  };
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title={plant.name} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dashboard-muted">Status:</span>
              <span className={`font-medium ${getStatusColor(plant.status)}`}>{getStatusText(plant.status)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <KpiCard 
              title="Potência Atual" 
              value={plant.currentPower.toFixed(2)} 
              unit="kW" 
              icon={<Zap className="h-5 w-5 text-primary" />}
            />
            <KpiCard 
              title="Energia Hoje" 
              value={plant.dailyEnergy.toFixed(2)} 
              unit="kWh" 
              icon={<Activity className="h-5 w-5 text-primary" />}
            />
            <KpiCard 
              title="Capacidade" 
              value={plant.capacity.toFixed(2)} 
              unit="kWp" 
              icon={<BarChart className="h-5 w-5 text-primary" />}
            />
            <KpiCard 
              title="Performance" 
              value={plant.performance} 
              unit="%" 
              icon={<Activity className="h-5 w-5 text-primary" />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AccelerometerChart 
                data={accelerometerData}
                currentPower={plant.currentPower}
                maxPower={plant.capacity}
              />
            </div>
            <div>
              <Card className="bg-dashboard-card border-gray-800">
                <CardHeader>
                  <CardTitle>Informações da Usina</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Nome:</span>
                    <span>{plant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Localização:</span>
                    <span>{plant.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Capacidade Total:</span>
                    <span>{plant.capacity} kWp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Energia Total Gerada:</span>
                    <span>{plant.totalEnergy.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Última Atualização:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Agora
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlantDetail;