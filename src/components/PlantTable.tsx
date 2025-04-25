
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PerformanceBar from './PerformanceBar';

export interface Plant {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentPower: number;
  dailyEnergy: number;
  totalEnergy: number;
  performance: number;
}

interface PlantTableProps {
  plants: Plant[];
}

const PlantTable: React.FC<PlantTableProps> = ({ plants }) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">Ativo</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/20 text-danger">Inativo</span>;
      case 'maintenance':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">Manutenção</span>;
    }
  };
  
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Usina</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Potência Atual</TableHead>
              <TableHead>Energia Hoje</TableHead>
              <TableHead>Fator de Capacidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((plant) => (
              <TableRow 
                key={plant.id} 
                className="cursor-pointer hover:bg-gray-800" 
                onClick={() => navigate(`/plant/${plant.id}`)}
              >
                <TableCell className="font-medium">{plant.name}</TableCell>
                <TableCell>{plant.location}</TableCell>
                <TableCell>{getStatusBadge(plant.status)}</TableCell>
                <TableCell>{plant.capacity} kWp</TableCell>
                <TableCell>{plant.currentPower} W</TableCell>
                <TableCell>{plant.dailyEnergy} kWh</TableCell>
                <TableCell className="w-44">
                  <PerformanceBar value={plant.performance} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlantTable;
