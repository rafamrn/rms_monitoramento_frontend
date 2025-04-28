import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KpiCard from '@/components/KpiCard';
import StatusChart from '@/components/StatusChart';
import PlantTable from '@/components/PlantTable';
import AlertsWidget from '@/components/AlertsWidget';
import { Plant } from '@/components/PlantTable';
import { BarChart, Activity, Zap, AlertCircle } from 'lucide-react';

const alertsData = [
  { id: 1, type: 'error', message: 'Usina Solar Praça Nova: Falha no inversor 2', time: 'Hoje, 08:32' },
  { id: 2, type: 'warning', message: 'Usina Solar Santa Luzia: Baixa produção detectada', time: 'Hoje, 09:15' },
  { id: 3, type: 'info', message: 'Manutenção programada: Usina Solar Cerrado', time: 'Amanhã, 10:00' }
];

const Dashboard: React.FC = () => {
  const [plantsData, setPlantsData] = useState<Plant[]>([]);

  useEffect(() => {
    axios.get('https://helpful-radiance-production.up.railway.app/usina') //http://127.0.0.1:8000/usina
      .then(res => {
        // Mapeando os dados das usinas recebidos do backend
        const usinas = res.data.usinas;

        // Junta as usinas com nome da "Escola Roda Pião"
        const rodapiao = usinas.filter((u: any) =>
          u.ps_name.toLowerCase().includes("rodapiao") ||
          u.ps_name.toLowerCase().includes("roda pião")
        );

        // Soma os dados das usinas da "Escola Roda Pião"
        const escolaRodapiaoUnificada: Plant = {
          id: "rodapiao",
          ps_ids: rodapiao.map((u: any) => u.ps_id.toString()), // 👈 pega todos ps_ids
          name: "013 - ESCOLA RODAPIÃO",
          location: "Vila Motta, 1049",
          status: "active",
          capacity: rodapiao.reduce((acc, u) => acc + parseFloat(u.capacidade || 0), 0),
          currentPower: rodapiao.reduce((acc, u) => acc + parseFloat(u.curr_power || 0), 0),
          dailyEnergy: rodapiao.reduce((acc, u) => acc + parseFloat(u.today_energy || 0), 0),
          totalEnergy: rodapiao.reduce((acc, u) => acc + parseFloat(u.total_energy || 0), 0),
          performance: 0, // será calculado logo abaixo
        };

        // Agora calcula a performance dessa usina também
        const currentPowerKW_Rodapiao = escolaRodapiaoUnificada.currentPower;
        escolaRodapiaoUnificada.performance = currentPowerKW_Rodapiao > 0
          ? Math.ceil((currentPowerKW_Rodapiao / (escolaRodapiaoUnificada.capacity)) * 100)
          : 0;

        // Remove as duas duplicadas da lista original
        const outrasUsinas = usinas.filter((u: any) =>
          !u.ps_name.toLowerCase().includes("rodapiao") &&
          !u.ps_name.toLowerCase().includes("roda pião")
        );

        // Mapeia as demais usinas normalmente
        const plantasRestantes: Plant[] = outrasUsinas.map((item: any) => {
          const capacidade = parseFloat(item.capacidade) || 0;
          const currentPower = parseFloat(item.curr_power) || 0;
          const currentPowerKW = currentPower;
          const performance = currentPowerKW > 0 ? Math.ceil(currentPowerKW / (capacidade) * 100) : 0;

          return {
            id: item.ps_id.toString(),
            name: item.ps_name,
            location: item.location || 'Não informado',
            status: 'active',
            capacity: capacidade,
            currentPower: currentPower,
            dailyEnergy: parseFloat(item.today_energy) || 0,
            totalEnergy: parseFloat(item.total_energy) || 0,
            performance: performance,
          };
        });

        // Junta tudo no state final
        setPlantsData([escolaRodapiaoUnificada, ...plantasRestantes]);
      })
      .catch(err => console.error('Erro ao carregar dados da API:', err));
  }, []);

  const totalPlants = plantsData.length;
  const activePlants = plantsData.filter(p => p.status === 'active').length;
  const inactivePlants = plantsData.filter(p => p.status === 'inactive').length;
  const maintenancePlants = plantsData.filter(p => p.status === 'maintenance').length;

  const totalCapacity = plantsData.reduce((sum, plant) => sum + plant.capacity, 0);
  const totalCurrentPower = plantsData.reduce((sum, plant) => sum + plant.currentPower, 0);
  const totalDailyEnergy = plantsData.reduce((sum, plant) => sum + plant.dailyEnergy, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Dashboard" />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <KpiCard 
              title="Potência Instantânea Total" 
              value={totalCurrentPower.toFixed(2)} 
              unit="kW" 
              icon={<Zap className="h-5 w-5 text-primary" />}
            />
            <KpiCard 
              title="Produção Diária" 
              value={totalDailyEnergy.toFixed(2)} 
              unit="kWh" 
              icon={<Activity className="h-5 w-5 text-primary" />}
            />
            <KpiCard 
              title="Capacidade Instalada" 
              value={totalCapacity.toFixed(2)} 
              unit="kWp" 
              icon={<BarChart className="h-5 w-5 text-primary" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PlantTable plants={plantsData} />
            </div>
            <div className="space-y-6">
              <StatusChart 
                total={totalPlants}
                active={activePlants}
                inactive={inactivePlants}
                maintenance={maintenancePlants}
              />
              <AlertsWidget alerts={alertsData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
