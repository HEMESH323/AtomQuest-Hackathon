import React from 'react';
import { Sidebar } from './Sidebar';
import { SimulationSelector } from './SimulationSelector';
import { Rocket, Bell, Menu } from 'lucide-react';
import { useGoal } from '../context/GoalContext';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePersona, activeTab, setActiveTab } = useGoal();

  return (
    <div className="flex min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-[280px]">
        {/* Top App Bar */}
        <header className="bg-surface-container-lowest sticky top-0 z-30 border-b border-outline-variant">
          <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto w-full">
            {/* Mobile Header Branding */}
            <div className="flex items-center gap-3 md:hidden">
              <Rocket className="text-primary w-6 h-6" fill="currentColor" fillOpacity={0.2} />
              <span className="font-display font-bold text-primary">AtomQuest</span>
            </div>

            {/* Desktop Page Title (Contextual) */}
            <div className="hidden md:block">
              <h1 className="font-display text-xl font-bold text-primary dark:text-primary-fixed-dim uppercase tracking-tight">
                {activeTab === 'dashboard' ? 'Insights & Approvals' : 
                 activeTab === 'goals' ? 'Goal Management' : 
                 activeTab === 'checkins' ? 'Performance Check-ins' : 
                 'Governance & Reporting'}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <SimulationSelector />
              <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
        
        {/* Mobile Nav Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant px-4 py-2 flex justify-around items-center z-40 pb-safe shadow-lg">
            <MobileNavItem 
              icon={<LayoutDashboardIcon />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            />
            <MobileNavItem 
              icon={<ListIcon />} 
              label="Goals" 
              active={activeTab === 'goals'} 
              onClick={() => setActiveTab('goals')}
            />
            <MobileNavItem 
              icon={<RepeatIcon />} 
              label="Check-ins" 
              active={activeTab === 'checkins'} 
              onClick={() => setActiveTab('checkins')}
            />
            <MobileNavItem 
              icon={<ChartIcon />} 
              label="Reports" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')}
            />
        </nav>
      </div>
    </div>
  );
};

const MobileNavItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-xl transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'}`}
  >
    {icon}
    <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
  </button>
);

// Inline icons for mobile nav to avoid many small files
const LayoutDashboardIcon = () => <LayoutDashboard className="w-5 h-5" />;
const ListIcon = () => <List className="w-5 h-5" />;
const RepeatIcon = () => <RotateCcw className="w-5 h-5" />;
const ChartIcon = () => <BarChart3 className="w-5 h-5" />;

import { LayoutDashboard, List, RotateCcw, BarChart3 } from 'lucide-react';
