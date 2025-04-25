
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  BarChart, 
  Home, 
  Settings, 
  AlertCircle, 
  Calendar, 
  Activity 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <Home className="w-5 h-5" />, 
      path: '/dashboard' 
    },
    { 
      label: 'Relatórios', 
      icon: <Activity className="w-5 h-5" />, 
      path: '/reports' 
    },
    { 
      label: 'Alertas', 
      icon: <AlertCircle className="w-5 h-5" />, 
      path: '/alerts' 
    },
    { 
      label: 'Configurações', 
      icon: <Settings className="w-5 h-5" />, 
      path: '/settings' 
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-dashboard-sidebar h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            U
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Usuário</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
