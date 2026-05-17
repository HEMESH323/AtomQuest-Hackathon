import React, { useState, useEffect } from 'react';
import { useGoal, Goal } from '../context/GoalContext';
import { PlusCircle, Trash2, Save, Send, AlertTriangle, CheckCircle2, ChevronDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EmployeeWorkspace: React.FC = () => {
  const { goals, setGoals, identities, activePersona } = useGoal();
  // Using a local draft state for the form, filtered by current employee
  const employeeName = identities[activePersona].name;
  const employeeGoals = goals.filter(g => g.assignedTo === employeeName);
  
  const [draftGoals, setDraftGoals] = useState<Goal[]>([]);

  // Sync draft with existing goals for this employee on load
  useEffect(() => {
    if (employeeGoals.length > 0) {
      setDraftGoals(employeeGoals);
    } else {
      // Start with one empty goal if none exists
      setDraftGoals([{
        id: Math.random().toString(36).substr(2, 9),
        thrustArea: '',
        title: '',
        description: '',
        uom: 'Min',
        target: 0,
        actual: 0,
        weightage: 0,
        status: 'Draft',
        assignedTo: employeeName
      }]);
    }
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalWeightage = draftGoals.reduce((sum, g) => sum + g.weightage, 0);
  const isValidWeightage = totalWeightage === 100;
  const isMinWeightageValid = draftGoals.every(g => g.weightage >= 10);
  const isGoalCountValid = draftGoals.length <= 8;

  const canSubmit = isValidWeightage && isMinWeightageValid && isGoalCountValid;

  useEffect(() => {
    if (totalWeightage !== 100) {
      setErrorMessage(`Current Total Weightage: ${totalWeightage}% / 100%. Total must equal 100%.`);
    } else if (!isMinWeightageValid) {
      setErrorMessage(`Min 10% per goal required.`);
    } else {
      setErrorMessage(null);
    }
  }, [totalWeightage, isMinWeightageValid]);

  const addGoal = () => {
    if (draftGoals.length >= 8) return;
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      thrustArea: '',
      title: '',
      description: '',
      uom: 'Min',
      target: 0,
      actual: 0,
      weightage: 0,
      status: 'Draft',
      assignedTo: employeeName
    };
    setDraftGoals([...draftGoals, newGoal]);
  };

  const removeGoal = (id: string) => {
    setDraftGoals(draftGoals.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setDraftGoals(draftGoals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const handleSaveDraft = () => {
    // Upsert draft goals into main context
    const otherEmployeesGoals = goals.filter(g => g.assignedTo !== employeeName);
    setGoals([...otherEmployeesGoals, ...draftGoals]);
    alert('Draft saved successfully!');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const submittedGoals = draftGoals.map(g => ({ ...g, status: 'Pending' as const }));
    const otherEmployeesGoals = goals.filter(g => g.assignedTo !== employeeName);
    setGoals([...otherEmployeesGoals, ...submittedGoals]);
    setDraftGoals(submittedGoals);
    alert('Goals submitted for approval!');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Validation Banner */}
      <motion.div 
        layout
        className={`border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors ${
          canSubmit ? 'bg-[#DCFCE7] border-green-200' : 'bg-[#FEF3C7] border-amber-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${canSubmit ? 'bg-green-100' : 'bg-amber-100'}`}>
            {canSubmit ? (
              <CheckCircle2 className="w-6 h-6 text-green-700" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            )}
          </div>
          <div>
            <h2 className={`font-display font-bold ${canSubmit ? 'text-green-800' : 'text-amber-800'}`}>
              {canSubmit ? 'Validation Passed: 100% / 100%. Ready to submit.' : errorMessage}
            </h2>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleSaveDraft}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-outline-variant px-6 py-2.5 rounded-lg text-on-surface font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
              canSubmit ? 'bg-[#2563EB] text-white hover:bg-blue-700' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
            }`}
          >
            <Send className="w-4 h-4" /> Submit for Approval
          </button>
        </div>
      </motion.div>

      {/* Goals List */}
      <div className="flex flex-col gap-6">
        <AnimatePresence initial={false}>
          {draftGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6 md:p-8 hover:bg-white hover:shadow-md transition-all group relative"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => removeGoal(goal.id)}
                  className="text-error hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[10px] bg-surface-container-high text-on-surface px-2 py-1 rounded-sm uppercase tracking-widest font-bold">
                  Goal #{index + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Thrust Area */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thrust Area</label>
                  <div className="relative">
                    <select 
                      value={goal.thrustArea}
                      onChange={(e) => updateGoal(goal.id, { thrustArea: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none"
                    >
                      <option value="">Select Area...</option>
                      <option value="innovation">Innovation & Tech</option>
                      <option value="operations">Operations Efficiency</option>
                      <option value="financial">Financial Growth</option>
                      <option value="customer">Customer Success</option>
                      <option value="people">People & Culture</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="md:col-span-9 flex flex-col gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Goal Title</label>
                    <input 
                      type="text"
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Enter measurable goal title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description / Key Results</label>
                    <textarea 
                      rows={2}
                      value={goal.description}
                      onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                      placeholder="Define how success will be measured..."
                    />
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-outline-variant/30">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Unit of Measure</label>
                    <div className="relative">
                      <select 
                        value={goal.uom}
                        onChange={(e) => updateGoal(goal.id, { uom: e.target.value as any })}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none"
                      >
                        <option value="Min">Min (Higher is better)</option>
                        <option value="Max">Max (Lower is better)</option>
                        <option value="Timeline">Timeline / Date</option>
                        <option value="Zero">Zero-based (Yes/No)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target</label>
                    <input 
                      type="number"
                      value={goal.target}
                      onChange={(e) => updateGoal(goal.id, { target: Number(e.target.value) })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-mono text-sm text-right focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Weightage (%)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={goal.weightage || ''}
                        onChange={(e) => updateGoal(goal.id, { weightage: Number(e.target.value) })}
                        className={`w-full bg-surface-container-lowest border rounded-lg p-3 font-mono text-sm text-right focus:ring-2 focus:ring-primary outline-none pr-8 ${
                          goal.weightage < 10 && goal.weightage > 0 ? 'border-amber-400' : 'border-outline-variant'
                        }`}
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-3 text-gray-400 text-sm font-mono">%</span>
                    </div>
                    {goal.weightage < 10 && goal.weightage > 0 && (
                      <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-tight">Minimum 10% required</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
          <button 
            onClick={addGoal}
            disabled={draftGoals.length >= 8}
            className="group flex items-center gap-3 text-primary font-bold text-sm bg-white border-2 border-primary border-dashed px-8 py-4 rounded-xl hover:bg-primary/5 transition-all w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add New Goal Row
          </button>
          <div className="flex items-start gap-2 text-on-surface-variant bg-surface-container-low py-3 px-6 rounded-xl border border-outline-variant/30 max-w-sm">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-[12px] leading-relaxed">
              <strong>Rules:</strong> Maximum 8 goals allowed. Total weightage must be exactly 100%. Individual goals must be at least 10%.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
