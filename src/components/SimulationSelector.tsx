import React from 'react';
import { useGoal, Persona } from '../context/GoalContext';
import { ChevronDown, User, Briefcase, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SimulationSelector: React.FC = () => {
  const { activePersona, setActivePersona, identities } = useGoal();
  const [isOpen, setIsOpen] = React.useState(false);

  const options: { id: Persona; label: string; icon: React.ReactNode }[] = [
    { id: 'employee', label: 'Employee View', icon: <User className="w-4 h-4" /> },
    { id: 'manager', label: 'Manager (L1) View', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin / HR View', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const current = options.find(o => o.id === activePersona);

  return (
    <div className="relative">
      <div className="flex flex-col items-end">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
          Simulation Control: Active Role
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-lg text-[13px] text-on-background hover:bg-surface-container-high transition-colors focus:ring-2 focus:ring-primary outline-none"
        >
          <span className="flex items-center gap-2">
            {current?.icon}
            {current?.label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <span className="text-[10px] text-on-surface-variant mt-1 text-right max-w-[220px]">
          Toggle to simulate different user journeys.
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-outline-variant bg-surface-container-low text-[11px] text-on-surface-variant leading-tight">
                Simulate different identities to test workflows.
              </div>
              <div className="flex flex-col py-1">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setActivePersona(opt.id);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-surface-container-low flex items-center gap-3 text-[13px] transition-colors text-left ${
                      activePersona === opt.id ? 'bg-primary/5 border-l-4 border-primary font-semibold text-primary' : 'text-on-background'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
