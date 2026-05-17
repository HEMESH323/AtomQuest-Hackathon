/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GoalProvider, useGoal } from './context/GoalContext';
import { MainLayout } from './components/MainLayout';
import { EmployeeWorkspace } from './views/EmployeeWorkspace';
import { ManagerDashboard } from './views/ManagerDashboard';
import { AdminGovernance } from './views/AdminGovernance';
import { AnimatePresence, motion } from 'motion/react';

const ViewSwitcher: React.FC = () => {
  const { activePersona, activeTab } = useGoal();

  const renderView = () => {
    // Priority 1: Map specific tabs to their primary views
    if (activeTab === 'goals' && activePersona === 'employee') {
      return <EmployeeWorkspace />;
    }
    if (activeTab === 'dashboard' && activePersona === 'manager') {
      return <ManagerDashboard />;
    }
    if (activeTab === 'reports' && activePersona === 'admin') {
      return <AdminGovernance />;
    }

    // Priority 2: Fallbacks if user clicks other tabs but we only have core views built
    // In a real app, each tab + persona combo would have a view.
    // For this prototype, we'll route to the "best match".
    if (activePersona === 'employee') return <EmployeeWorkspace />;
    if (activePersona === 'manager') return <ManagerDashboard />;
    if (activePersona === 'admin') return <AdminGovernance />;

    return <EmployeeWorkspace />;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${activePersona}-${activeTab}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <GoalProvider>
      <MainLayout>
        <ViewSwitcher />
      </MainLayout>
    </GoalProvider>
  );
}
