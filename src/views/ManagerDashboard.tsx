import React from 'react';
import { useGoal, Goal } from '../context/GoalContext';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const ManagerDashboard: React.FC = () => {
  const { goals, calculateProgress, identities, activePersona, approveAllGoals, requestRework, updateGoal } = useGoal();
  const manager = identities[activePersona];
  const teamMembers = manager.team || [];
  
  const [selectedMember, setSelectedMember] = React.useState(teamMembers[0] || '');
  const [comments, setComments] = React.useState('');

  const memberGoals = goals.filter(g => g.assignedTo === selectedMember);
  const pendingGoals = memberGoals.filter(g => g.status === 'Pending');
  const isApproved = memberGoals.length > 0 && memberGoals.every(g => g.status === 'Approved');
  const totalWeightage = memberGoals.reduce((sum, g) => sum + g.weightage, 0);

  const handleApprove = () => {
    approveAllGoals(selectedMember);
    alert(`Goals for ${selectedMember} approved and locked.`);
    setComments('');
  };

  const handleRework = () => {
    requestRework(selectedMember);
    alert(`Return for rework request sent to ${selectedMember}.`);
    setComments('');
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Team Approvals Header */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-on-surface">Team Validation Queue</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
            {goals.filter(g => teamMembers.includes(g.assignedTo || '') && g.status === 'Pending').length} Pending Actions
          </span>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {teamMembers.map(member => {
            const memberGoals = goals.filter(g => g.assignedTo === member);
            const status = memberGoals.some(g => g.status === 'Pending') ? 'Pending' : 
                         memberGoals.some(g => g.status === 'Rework') ? 'Rework' : 'Approved';
            return (
              <TeamCard 
                key={member}
                name={member} 
                role={member === 'John Doe' ? 'Software Engineer' : 'Marketing Lead'} 
                status={status} 
                active={selectedMember === member}
                onClick={() => setSelectedMember(member)}
                image={member === 'John Doe' ? 
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150" : 
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"}
              />
            );
          })}
        </div>
      </section>

      {/* Goal Review Panel */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="bg-surface-container-low px-8 py-5 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h2 className="text-lg font-display font-bold text-on-surface">Strategic Goal Review</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5 tracking-tight">Viewing detailed sheet for: {selectedMember}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Total Weightage</span>
            <span className="text-xl font-display font-bold text-primary">{totalWeightage}%</span>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {memberGoals.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant italic">No goals submitted by this employee yet.</div>
          ) : (
            memberGoals.map((goal) => (
              <GoalReviewItem 
                key={goal.id} 
                goal={goal} 
                progress={calculateProgress(goal)} 
                onUpdateActual={(val) => updateGoal(goal.id, { actual: val })}
              />
            ))
          )}
        </div>

        {/* Global Action Bar */}
        <div className="bg-surface-container-lowest border-t border-outline-variant p-6 flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Manager Review Comments</label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant h-20"
              placeholder="Provide context for approval or specific rework instructions..."
            />
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button 
              disabled={pendingGoals.length === 0}
              onClick={handleRework}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-error/20 text-error hover:bg-error/5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" /> Return for Rework
            </button>
            <button 
              disabled={pendingGoals.length === 0 || totalWeightage !== 100}
              onClick={handleApprove}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve & Lock Goals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const TeamCard = ({ name, role, status, active = false, image, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex-shrink-0 w-64 p-4 rounded-xl border-2 transition-all cursor-pointer snap-start flex flex-col gap-4 ${
    active ? 'bg-white border-primary shadow-lg ring-4 ring-primary/5' : 'bg-surface-container-lowest border-outline-variant hover:border-primary/50'
  }`}>
    <div className="flex items-center justify-between">
      <img src={image} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
        status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
        status === 'Rework' ? 'bg-error-container text-error' : 
        'bg-green-100 text-green-700'
      }`}>
        {status}
      </span>
    </div>
    <div>
      <h3 className="font-display font-bold text-on-surface text-sm">{name}</h3>
      <p className="text-[11px] text-on-surface-variant font-medium">{role}</p>
    </div>
  </div>
);

interface GoalReviewItemProps {
  goal: Goal;
  progress: number;
  onUpdateActual: (val: number) => void;
}

const GoalReviewItem: React.FC<GoalReviewItemProps> = ({ goal, progress, onUpdateActual }) => (
  <div className="flex flex-col md:flex-row gap-6 group">
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-secondary uppercase bg-surface-container-high px-2 py-1 rounded tracking-tighter">
          {goal.thrustArea}
        </span>
        <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase ${
          goal.status === 'Approved' ? 'border-green-300 text-green-700 bg-green-50' :
          goal.status === 'Pending' ? 'border-amber-300 text-amber-700 bg-amber-50' :
          'border-outline-variant text-on-surface-variant bg-surface'
        }`}>
          {goal.status}
        </span>
      </div>
      <h4 className="font-display text-lg font-bold text-on-surface">{goal.title}</h4>
      <p className="text-sm text-on-surface-variant leading-relaxed">{goal.description}</p>
      
      {/* Progress Visualization */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Historical Trend</span>
          <span className="text-[11px] font-bold text-primary">{Math.round(progress)}% Progress</span>
        </div>
        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-primary' : 'bg-amber-500'
            }`}
          />
        </div>
      </div>
    </div>

    <div className="w-full md:w-64 grid grid-cols-2 gap-4">
      <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 flex flex-col gap-1">
        <span className="text-[9px] font-bold text-on-surface-variant uppercase">Target</span>
        <span className="font-mono text-sm font-bold text-on-surface">{goal.target} {goal.uom === 'Min' ? '%' : ''}</span>
      </div>
      <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 flex flex-col gap-1">
        <span className="text-[9px] font-bold text-on-surface-variant uppercase">Weightage</span>
        <span className="font-mono text-sm font-bold text-primary">{goal.weightage}%</span>
      </div>
      <div className={`col-span-2 p-4 bg-white border rounded-lg flex flex-col gap-1 ring-1 ring-primary/5 transition-all ${
        goal.status === 'Approved' ? 'border-green-200 opacity-80 pointer-events-none' : 'border-primary/20'
      }`}>
        <span className="text-[9px] font-bold text-primary uppercase">Actual Performance</span>
        <input 
          type="number"
          value={goal.actual}
          onChange={(e) => onUpdateActual(Number(e.target.value))}
          disabled={goal.status === 'Approved'}
          className="bg-transparent border-none font-mono text-lg font-bold text-primary focus:ring-0 p-0 text-right w-full"
        />
      </div>
    </div>
  </div>
);
