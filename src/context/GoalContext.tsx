import React, { createContext, useContext, useState, useEffect } from 'react';

export type Persona = 'employee' | 'manager' | 'admin';
export type AppTab = 'dashboard' | 'goals' | 'checkins' | 'reports';

export interface Goal {
  id: string;
  thrustArea: string;
  title: string;
  description: string;
  uom: 'Min' | 'Max' | 'Timeline' | 'Zero';
  target: number;
  actual: number;
  weightage: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rework' | 'Overdue';
  deadline?: string;
  completedDate?: string;
  assignedTo?: string;
}

interface UserIdentity {
  name: string;
  dept: string;
  role: string;
  manager?: string;
  team?: string[];
}

interface GoalContextType {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  identities: Record<Persona, UserIdentity>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  calculateProgress: (goal: Goal) => number;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  submitGoalsForApproval: (employeeName: string) => void;
  approveAllGoals: (employeeName: string) => void;
  requestRework: (employeeName: string) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<Persona>('employee');
  const [activeTab, setActiveTab] = useState<AppTab>('goals');

  // Sync tab with persona initial state
  useEffect(() => {
    if (activePersona === 'employee') setActiveTab('goals');
    if (activePersona === 'manager') setActiveTab('dashboard');
    if (activePersona === 'admin') setActiveTab('reports');
  }, [activePersona]);
  
  const identities: Record<Persona, UserIdentity> = {
    employee: {
      name: "John Doe",
      dept: "Engineering",
      role: "Software Engineer",
      manager: "Sarah Jenkins"
    },
    manager: {
      name: "Sarah Jenkins",
      dept: "Engineering",
      role: "Engineering Manager",
      team: ["John Doe", "Michael Chang"]
    },
    admin: {
      name: "Global HR Operations",
      dept: "HR",
      role: "Governance Administrator"
    }
  };

  const [goals, setGoals] = useState<Goal[]>([]);

  // Initialize with some seed data if empty
  useEffect(() => {
    setGoals([
      {
        id: '1',
        thrustArea: 'innovation',
        title: 'Optimize Data Pipeline',
        description: 'Reduce latency by 30% without increasing costs.',
        uom: 'Min',
        target: 30,
        actual: 22,
        weightage: 40,
        status: 'Pending',
        assignedTo: 'John Doe'
      },
      {
        id: '2',
        thrustArea: 'operations',
        title: 'Automated QA Checks',
        description: 'Deploy daily QA scripts for top 5 datasets.',
        uom: 'Min',
        target: 5,
        actual: 3,
        weightage: 35,
        status: 'Pending',
        assignedTo: 'Michael Chang'
      },
      {
        id: '3',
        thrustArea: 'people',
        title: 'Advanced SQL Certification',
        description: 'Acquire Level 3 certification.',
        uom: 'Zero',
        target: 1,
        actual: 1,
        weightage: 25,
        status: 'Approved',
        assignedTo: 'John Doe'
      }
    ]);
  }, []);

  const addGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const submitGoalsForApproval = (employeeName: string) => {
    setGoals(prev => prev.map(g => g.assignedTo === employeeName && g.status === 'Draft' ? { ...g, status: 'Pending' } : g));
  };

  const approveAllGoals = (employeeName: string) => {
    setGoals(prev => prev.map(g => g.assignedTo === employeeName && g.status === 'Pending' ? { ...g, status: 'Approved' } : g));
  };

  const requestRework = (employeeName: string) => {
    setGoals(prev => prev.map(g => g.assignedTo === employeeName && g.status === 'Pending' ? { ...g, status: 'Rework' } : g));
  };

  const calculateProgress = (goal: Goal): number => {
    switch (goal.uom) {
      case 'Min': // Higher is better
        return goal.target <= 0 ? 0 : Math.min(100, (goal.actual / goal.target) * 100);
      case 'Max': // Lower is better
        return goal.actual <= 0 ? 100 : Math.min(100, (goal.target / goal.actual) * 100);
      case 'Timeline':
        if (!goal.completedDate || !goal.deadline) return 0;
        return new Date(goal.completedDate) <= new Date(goal.deadline) ? 100 : 0;
      case 'Zero':
        return goal.actual === 0 ? 100 : 0;
      default:
        return 0;
    }
  };

  // Corporate Guidelines override from prompt:
  // UoM == "Min" (Higher is better) -> Formula: (Actual / Target) * 100
  // UoM == "Max" (Lower is better) -> Formula: (Target / Actual) * 100
  // UoM == "Timeline" -> Completion Date vs Deadline
  // UoM == "Zero" -> If Actual == 0 return 100%, else return 0%

  return (
    <GoalContext.Provider value={{ 
      activePersona, 
      setActivePersona, 
      activeTab, 
      setActiveTab, 
      identities, 
      goals, 
      setGoals, 
      calculateProgress,
      addGoal,
      updateGoal,
      deleteGoal,
      submitGoalsForApproval,
      approveAllGoals,
      requestRework
    }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoal must be used within a GoalProvider');
  return context;
};
