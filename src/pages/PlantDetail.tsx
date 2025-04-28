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
import axios from 'axios';

// Função para gerar dados simulados para o gráfico
const generateAccelerometerData = (hours: number, maxPower: number, currentPower: number) => {
  const data = [];
  const now = new Date();

  for (let i = 0; i < hours * 12; i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - (hours * 60) + (i * 5));

    const progress = i / (hours * 12);
    const randomFactor = Math.random() * 0.2 - 0.1;
    const baseValue = maxPower * 0.8 * Math.sin((i / (hours * 12)) * Math.PI) + maxPower * 0.1;
    let value = baseValue * (1 + randomFactor);

    if (progress > 0.8) {
      const weight = (progress - 0.8) * 5;
      value = value * (1 - weight) + currentPower * weight;
    }

    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      value: Number(value.toFixed(2)),
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
    if (id) {
      console.log("Buscando dados para o id:", id); // Log do id
  
      axios.get('https://helpful-radiance-production.up.railway.app/usina') //http://127.0.0.1:8000/usina
        .then(res => {
          console.log("Dados recebidos:", res.data); // Log dos dados da API
  
          const usinas = res.data.usinas;
          
          // Verifica se o nome da usina contém 'rodapiao' (case insensitive)
          if (id.toLowerCase() === 'rodapiao') {
            // Filtra todas as usinas que contêm "Roda Pião" no nome
            const rodapiaoUsinas = usinas.filter((u: any) => u.ps_name.toLowerCase().includes('roda pião'));
  
            console.log("Usinas Rodapião encontradas:", rodapiaoUsinas); // Log do filtro das usinas
  
            if (rodapiaoUsinas.length > 0) {
              // Somando os valores das usinas que têm "Rodapião" no nome
              const capacidadeTotal = rodapiaoUsinas.reduce((sum: number, u: any) => sum + (parseFloat(u.capacidade) || 0), 0);
              const currentPowerTotal = rodapiaoUsinas.reduce((sum: number, u: any) => sum + (parseFloat(u.curr_power) || 0), 0);
              const dailyEnergyTotal = rodapiaoUsinas.reduce((sum: number, u: any) => sum + (parseFloat(u.today_energy) || 0), 0);
              const totalEnergyTotal = rodapiaoUsinas.reduce((sum: number, u: any) => sum + (parseFloat(u.total_energy) || 0), 0);
              const performance = capacidadeTotal > 0 ? Math.round((currentPowerTotal / capacidadeTotal) * 100) : 0;
  
              // Criando um objeto de usina consolidada
              const plantData: Plant = {
                id: 'rodapiao', // Id fixo para Rodapião
                name: 'Escola Roda Pião', // Nome consolidado
                location: 'Localização Consolidada', // Localização consolidada
                status: 'active', // Definir como ativo (ajuste conforme backend)
                capacity: capacidadeTotal,
                currentPower: currentPowerTotal,
                dailyEnergy: dailyEnergyTotal,
                totalEnergy: totalEnergyTotal,
                performance: performance,
              };
  
              setPlant(plantData);
  
              // Gerando dados para o gráfico de aceleração
              const data = generateAccelerometerData(6, capacidadeTotal, currentPowerTotal);
              setAccelerometerData(data);
            }
          } else {
            // Para os outros ids, busca normalmente
            const usina = usinas.find((u: any) => u.ps_id.toString() === id);
  
            if (usina) {
              const capacidade = parseFloat(usina.capacidade) || 0;
              const currentPower = parseFloat(usina.curr_power) || 0;
              const performance = capacidade > 0 ? Math.round((currentPower / capacidade) * 100) : 0;
  
              const plantData: Plant = {
                id: usina.ps_id.toString(),
                name: usina.ps_name,
                location: usina.location || 'Não informado',
                status: 'active',
                capacity: capacidade,
                currentPower: currentPower,
                dailyEnergy: parseFloat(usina.today_energy) || 0,
                totalEnergy: parseFloat(usina.total_energy) || 0,
                performance: performance,
              };
  
              setPlant(plantData);
              const data = generateAccelerometerData(6, capacidade, currentPower);
              setAccelerometerData(data);
            }
          }
        })
        .catch(err => {
          console.error('Erro ao buscar usinas:', err);
        });
    }
  }, [id]);

  // (restante do seu código permanece igual)

  const getStatusText = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'maintenance': return 'Em Manutenção';
    }
  };

  const getStatusColor = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
    }
  };

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title={plant.name} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dashboard-muted">Status:</span>
              <span className={`font-medium ${getStatusColor(plant.status)}`}>{getStatusText(plant.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <KpiCard title="Potência Atual" value={plant.currentPower.toFixed(2)} unit="kW" icon={<Zap className="h-5 w-5 text-primary" />} />
            <KpiCard title="Energia Hoje" value={plant.dailyEnergy.toFixed(2)} unit="kWh" icon={<Activity className="h-5 w-5 text-primary" />} />
            <KpiCard title="Capacidade" value={plant.capacity.toFixed(2)} unit="kWp" icon={<BarChart className="h-5 w-5 text-primary" />} />
            <KpiCard title="Potência Instantânea" value={plant.currentPower} unit="%" icon={<Activity className="h-5 w-5 text-primary" />} />
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
                    <span className="text-dashboard-muted">Capacidade:</span>
                    <span>{plant.capacity} kWp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Total de Energia:</span>
                    <span>{plant.totalEnergy.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dashboard-muted">Última Atualização:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Agora
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
