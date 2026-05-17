import React from 'react';
import { useGoal, AppTab } from '../context/GoalContext';
import { 
  Atom, 
  LayoutDashboard, 
  List, 
  RotateCcw, 
  BarChart3,
  User
} from 'lucide-react';
import { motion } from 'motion/react';

const navItems: { id: AppTab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'goals', label: 'Goal Sheet', icon: List },
  { id: 'checkins', label: 'Quarterly Check-ins', icon: RotateCcw },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const { activePersona, activeTab, setActiveTab, identities } = useGoal();
  const identity = identities[activePersona];

  return (
    <nav className="hidden md:flex flex-col gap-4 pt-8 bg-surface-container-low border-r border-outline-variant shadow-sm h-screen w-[280px] fixed left-0 top-0 z-40">
      <div className="px-8 mb-6 flex items-center gap-3">
        <Atom className="text-secondary w-8 h-8 rotate-12" />
        <span className="font-display text-lg font-bold text-primary tracking-tight">AtomQuest</span>
      </div>

      <div className="px-8 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
          <User className="text-on-surface-variant w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="font-display text-xs font-bold text-on-surface">{identity.name}</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{identity.role}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2 relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group relative w-full text-left ${
                isActive 
                  ? 'bg-secondary-container text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-white/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              <span className="text-[13px] font-medium tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
