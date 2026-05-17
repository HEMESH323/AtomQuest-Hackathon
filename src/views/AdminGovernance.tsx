import React, { useState } from 'react';
import { useGoal, Goal } from '../context/GoalContext';
import { 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  X,
  Target,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const AdminGovernance: React.FC = () => {
  const { goals, calculateProgress } = useGoal();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalFilterEmployee, setGoalFilterEmployee] = useState<string>('All');
  const [registryThrustArea, setRegistryThrustArea] = useState('All');
  const [registryStatus, setRegistryStatus] = useState('All');
  const goalRegistryRef = React.useRef<HTMLDivElement>(null);

  // Derived Admin Metrics
  const approvedGoals = goals.filter(g => g.status === 'Approved');
  const avgProgress = goals.length > 0 
    ? goals.reduce((acc, g) => acc + calculateProgress(g), 0) / goals.length 
    : 0;
  const pendingApprovalsCount = goals.filter(g => g.status === 'Pending').length;
  const overdueCount = goals.filter(g => g.status === 'Overdue').length;

  const scrollToRegistry = () => {
    goalRegistryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewGoals = (name: string) => {
    setGoalFilterEmployee(name);
    setRegistryThrustArea('All');
    setRegistryStatus('All');
    setTimeout(scrollToRegistry, 100);
  };

  const employees = [
    { id: '1', name: 'John Doe', dept: 'Engineering', q1: 'done', q2: 'done', q3: 'done', q4: 'pending', status: 'Pending' },
    { id: '2', name: 'Michael Chang', dept: 'Marketing', q1: 'done', q2: 'done', q3: 'overdue', q4: 'pending', status: 'Overdue' },
    { id: '3', name: 'Elena Rodriguez', dept: 'Sales', q1: 'done', q2: 'draft', q3: 'pending', q4: 'pending', status: 'Draft' },
    { id: '4', name: 'Sarah Jenkins', dept: 'Engineering', q1: 'done', q2: 'done', q3: 'done', q4: 'done', status: 'Approved' },
    { id: '5', name: 'Anita Bose', dept: 'HR', q1: 'done', q2: 'done', q3: 'done', q4: 'done', status: 'Approved' },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = activeDept === 'All' || emp.dept === activeDept;
    const matchesStatus = activeStatus === 'All' || emp.status === activeStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const exportData = () => {
    const headers = ['ID', 'Employee', 'Goal', 'Thrust Area', 'Weightage', 'Progress', 'Status'];
    const rows = goals.map(g => [
        g.id,
        g.assignedTo || 'Unassigned',
        `"${g.title}"`,
        g.thrustArea,
        `${g.weightage}%`,
        `${Math.round(calculateProgress(g))}%`,
        g.status
      ]
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'strategic_achievement_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-10">
      <AnimatePresence>
        {selectedGoal && (
          <GoalDetailModal 
            goal={selectedGoal} 
            progress={calculateProgress(selectedGoal)} 
            onClose={() => setSelectedGoal(null)} 
          />
        )}
      </AnimatePresence>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
          title="Overall Completion Rate" 
          value={`${Math.round(avgProgress)}%`} 
          subtitle="Enterprise-wide Average Progress"
          icon={<TrendingUp className="text-primary" />}
          progress={avgProgress}
        />
        <MetricCard 
          title="Action Items Queue" 
          value={pendingApprovalsCount} 
          subtitle="Goals awaiting manager review"
          icon={<ClockIcon />}
          trend={`${pendingApprovalsCount} total pending`}
        />
        <MetricCard 
          title="Critical Escalations" 
          value={overdueCount} 
          subtitle="Overdue strategic milestones"
          variant={overdueCount > 0 ? 'error' : 'default'}
          icon={<AlertCircle className={overdueCount > 0 ? "text-white" : "text-amber-500"} />}
          action={overdueCount > 0 ? "Resolve Escalations" : undefined}
        />
      </div>

      {/* Compliance Matrix */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-display font-bold text-lg text-on-surface">Employee Compliance Matrix</h3>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-sm bg-surface focus:ring-2 focus:ring-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              value={activeDept}
              onChange={(e) => setActiveDept(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Product">Product</option>
              <option value="HR">HR</option>
            </select>

            <select 
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            <button 
              onClick={exportData}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Q1</th>
                <th className="px-6 py-4 text-center">Q2</th>
                <th className="px-6 py-4 text-center">Q3</th>
                <th className="px-6 py-4 text-center">Q4</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {filteredEmployees.map(emp => (
                <ComplianceRow 
                  key={emp.id}
                  name={emp.name} 
                  dept={emp.dept} 
                  q1={emp.q1} 
                  q2={emp.q2} 
                  q3={emp.q3} 
                  q4={emp.q4}
                  onAction={() => setSelectedGoal(goals[0])} 
                  onViewGoals={() => handleViewGoals(emp.name)}
                />
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant italic">
                    No employees matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-outline-variant bg-surface flex justify-between items-center">
          <span className="text-xs text-on-surface-variant">
            Showing {filteredEmployees.length} of {employees.length} entries
          </span>
          <div className="flex gap-1">
             <PaginationButton disabled icon={<ChevronLeft />} />
             <PaginationButton active label="1" />
             <PaginationButton label="2" />
             <PaginationButton label="3" />
             <PaginationButton icon={<ChevronRight />} />
          </div>
        </div>
      </section>

      {/* Priority Goal Registry (Direct interaction with goals) */}
      <section ref={goalRegistryRef} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-10 transition-all duration-500">
        <div className="p-6 border-b border-outline-variant flex flex-col gap-6 bg-surface-container-low">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-display font-bold text-lg text-on-surface">Priority Goal Registry</h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Global Performance Monitoring Queue</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={goalFilterEmployee}
                onChange={(e) => setGoalFilterEmployee(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="All">All Employees</option>
                {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
              </select>

              <select 
                value={registryThrustArea}
                onChange={(e) => setRegistryThrustArea(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="All">All Areas</option>
                {Array.from(new Set(goals.map(g => g.thrustArea))).map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>

              <select 
                value={registryStatus}
                onChange={(e) => setRegistryStatus(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
                <option value="Overdue">Overdue</option>
              </select>

              {(goalFilterEmployee !== 'All' || registryThrustArea !== 'All' || registryStatus !== 'All') && (
                <button 
                  onClick={() => {
                    setGoalFilterEmployee('All');
                    setRegistryThrustArea('All');
                    setRegistryStatus('All');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-on-surface/5 hover:bg-on-surface/10 rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest transition-colors"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface/50">
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Thrust Area</th>
                <th className="px-6 py-3">Goal Title</th>
                <th className="px-6 py-3 text-center">Weight</th>
                <th className="px-6 py-3 text-center">Progress</th>
                <th className="px-6 py-3 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-outline-variant">
              {goals.filter(goal => {
                const matchesEmployee = goalFilterEmployee === 'All' || goal.assignedTo === goalFilterEmployee;
                const matchesThrust = registryThrustArea === 'All' || goal.thrustArea === registryThrustArea;
                const matchesStatus = registryStatus === 'All' || goal.status === registryStatus;
                return matchesEmployee && matchesThrust && matchesStatus;
              }).map(goal => (
                <tr 
                  key={goal.id} 
                  onClick={() => setSelectedGoal(goal)}
                  className="hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{goal.assignedTo || 'Unassigned'}</span>
                      <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-tight">Level 4 Tier</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container-high px-2 py-1 rounded text-[9px] font-bold uppercase transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {goal.thrustArea}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{goal.title}</span>
                      <span className="text-[10px] text-on-surface-variant truncate w-48">{goal.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-on-surface-variant">{goal.weightage}%</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-bold text-primary">{Math.round(calculateProgress(goal))}%</span>
                      <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${calculateProgress(goal)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[9px] font-bold text-primary uppercase border border-primary/20 px-2 py-1 rounded hover:bg-primary hover:text-white transition-all">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {goals.filter(goal => {
                const matchesEmployee = goalFilterEmployee === 'All' || goal.assignedTo === goalFilterEmployee;
                const matchesThrust = registryThrustArea === 'All' || goal.thrustArea === registryThrustArea;
                const matchesStatus = registryStatus === 'All' || goal.status === registryStatus;
                return matchesEmployee && matchesThrust && matchesStatus;
              }).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant italic">
                    No strategic goals found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Goal Distribution Chart */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display font-bold text-lg text-on-surface">Goal Distribution by Thrust Area</h3>
          <BarChart3 className="text-on-surface-variant w-5 h-5" />
        </div>
        
        <div className="flex flex-col gap-6">
          <DistributionRow label="Revenue Growth" val={85} color="bg-primary" priority="High" />
          <DistributionRow label="Customer Success" val={62} color="bg-primary/70" priority="Medium" />
          <DistributionRow label="Op. Efficiency" val={45} color="bg-primary/50" priority="Medium" />
          <DistributionRow label="Team Development" val={30} color="bg-primary/30" priority="Low" />
        </div>

        <div className="mt-10 flex justify-center gap-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
           <div className="flex items-center gap-2"><span className="w-3 h-1 bg-primary rounded-full"></span> High Focus</div>
           <div className="flex items-center gap-2"><span className="w-3 h-1 bg-primary/60 rounded-full"></span> Medium Focus</div>
           <div className="flex items-center gap-2"><span className="w-3 h-1 bg-primary/20 rounded-full"></span> Supporting</div>
        </div>
      </section>

      {/* Weightage Distribution Donut Chart */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display font-bold text-lg text-on-surface">Weightage Allocation by Thrust Area</h3>
          <PieChartIcon className="text-on-surface-variant w-5 h-5" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goals.reduce((acc, goal) => {
                    const existing = acc.find(item => item.name === (goal.thrustArea || 'Other'));
                    if (existing) {
                      existing.value += goal.weightage;
                    } else {
                      acc.push({ name: goal.thrustArea || 'Other', value: goal.weightage });
                    }
                    return acc;
                  }, [] as { name: string; value: number }[])}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {goals.reduce((acc, goal) => {
                    if (!acc.includes(goal.thrustArea || 'Other')) {
                      acc.push(goal.thrustArea || 'Other');
                    }
                    return acc;
                  }, [] as string[]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Weightage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Thrust Area Analysis</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Weight</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {goals.reduce((acc, goal) => {
                const existing = acc.find(item => item.name === (goal.thrustArea || 'Other'));
                if (existing) {
                  existing.value += goal.weightage;
                } else {
                  acc.push({ name: goal.thrustArea || 'Other', value: goal.weightage });
                }
                return acc;
              }, [] as { name: string; value: number }[]).map((item, index) => (
                <div 
                  key={item.name} 
                  onClick={() => {
                    // Find first goal in this area to show detail as an example
                    const goalInArea = goals.find(g => g.thrustArea === item.name);
                    if (goalInArea) setSelectedGoal(goalInArea);
                  }}
                  className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/40 transition-all hover:shadow-sm hover:border-primary/40 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-1.5 h-8 rounded-full" 
                      style={{ backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5] }} 
                    />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-on-surface uppercase tracking-tight leading-none mb-1">{item.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">Click to view goals</span>
                    </div>
                  </div>
                  <div className="bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    <span className="text-sm font-mono font-bold text-primary">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Thrust Area Operational Pulse (Aggregated Progress) */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/5 rounded-lg">
                 <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">Thrust Area Operational Pulse</h3>
           </div>
           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Real-time Performance Index</span>
        </div>

        <div className="flex flex-col gap-8">
          {goals.reduce((acc, goal) => {
            const area = goal.thrustArea || 'Other';
            const existing = acc.find(item => item.name === area);
            const progress = calculateProgress(goal);
            if (existing) {
              existing.totalProgress += progress;
              existing.count += 1;
            } else {
              acc.push({ name: area, totalProgress: progress, count: 1 });
            }
            return acc;
          }, [] as { name: string; totalProgress: number; count: number }[]).map((item, index) => {
            const avgProgress = item.totalProgress / item.count;
            return (
              <div key={item.name} className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5] }} 
                      />
                      <span className="text-xs font-bold text-on-surface uppercase tracking-tight">{item.name}</span>
                   </div>
                   <span className="text-sm font-mono font-bold text-primary">{Math.round(avgProgress)}% Complete</span>
                </div>
                <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${avgProgress}%` }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full rounded-full bg-primary"
                     style={{ 
                        backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5],
                        boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)'
                     }}
                   />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                   <span>Goal Threshold</span>
                   <span>Strategic Alignment</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Aggregated Thrust Area Summary */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-on-surface/5 rounded-lg">
                 <FileText className="w-5 h-5 text-on-surface-variant" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">Thrust Area Aggregation Summary</h3>
           </div>
           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Enterprise Weightage Map</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {goals.reduce((acc, goal) => {
              const area = goal.thrustArea || 'Other';
              const existing = acc.find(item => item.name === area);
              if (existing) {
                existing.value += goal.weightage;
                existing.count += 1;
              } else {
                acc.push({ name: area, value: goal.weightage, count: 1 });
              }
              return acc;
            }, [] as { name: string; value: number; count: number }[]).map((item, index) => (
              <div key={item.name} className="flex flex-col gap-4 p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low transition-all hover:bg-surface-container-high group">
                <div className="flex justify-between items-start">
                   <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg shadow-sm group-hover:scale-110 transition-transform" 
                      style={{ backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5] }}
                   >
                     {item.name.charAt(0)}
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Weight</span>
                      <span className="text-xl font-mono font-bold text-primary">{item.value}%</span>
                   </div>
                </div>
                <div className="flex flex-col gap-1">
                   <h4 className="text-xs font-bold text-on-surface uppercase tracking-tight truncate">{item.name}</h4>
                   <p className="text-[10px] text-on-surface-variant font-medium">Monitoring {item.count} Strategic Goals</p>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-2">
                   <div className="h-full bg-primary/40 rounded-full" style={{ width: `${item.value}%` }} />
                </div>
              </div>
           ))}
        </div>
      </section>

      {/* Weightage Allocation Bar Chart */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display font-bold text-lg text-on-surface">Weightage Allocation Benchmark</h3>
          <BarChart3 className="text-on-surface-variant w-5 h-5" />
        </div>
        
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={goals.reduce((acc, goal) => {
                const existing = acc.find(item => item.name === (goal.thrustArea || 'Other'));
                if (existing) {
                  existing.value += goal.weightage;
                } else {
                  acc.push({ name: goal.thrustArea || 'Other', value: goal.weightage });
                }
                return acc;
              }, [] as { name: string; value: number }[])}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#44474e' }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                formatter={(value: number) => [`${value}%`, 'Total Weightage']}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                barSize={24}
              >
                {goals.reduce((acc, goal) => {
                  const existing = acc.find(item => item.name === (goal.thrustArea || 'Other'));
                  if (existing) {
                    existing.value += goal.weightage;
                  } else {
                    acc.push({ name: goal.thrustArea || 'Other', value: goal.weightage });
                  }
                  return acc;
                }, [] as { name: string; value: number }[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const GoalDetailModal = ({ goal, progress, onClose }: { goal: Goal; progress: number; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
      >
        <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-on-surface">Goal Particulars</h2>
              <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">{goal.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded w-max uppercase tracking-widest leading-none">
              {goal.thrustArea}
            </span>
            <h3 className="text-2xl font-display font-bold text-on-surface leading-tight tracking-tight">
              {goal.title}
            </h3>
          </div>

          {/* Progress Bar Section */}
          <div className="bg-surface border border-outline-variant/30 p-6 rounded-xl">
             <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Quantifiable Progress</span>
                <span className="text-sm font-mono font-bold text-primary">{Math.round(progress)}%</span>
             </div>
             <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-primary' : 'bg-amber-500'
                  }`}
                />
             </div>
             <div className="mt-4 flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
                <span>Current: <span className="font-mono text-on-surface font-bold">{goal.actual}</span></span>
                <span>Target: <span className="font-mono text-on-surface font-bold">{goal.target} {goal.uom === 'Min' ? '%' : ''}</span></span>
             </div>
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
               <FileText className="w-3.5 h-3.5" />
               Substantive Description
             </div>
             <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap bg-surface-container-low p-4 rounded-lg border border-outline-variant/10 italic">
               "{goal.description}"
             </p>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Weightage</span>
                <span className="text-lg font-mono font-bold text-primary">{goal.weightage}%</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Status</span>
                <div className="flex items-center gap-1.5 pt-1">
                   {goal.status === 'Approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <ClockIcon className="w-4 h-4 text-amber-500" />}
                   <span className="text-xs font-bold text-on-surface">{goal.status}</span>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Unit of Measure</span>
                <span className="text-xs font-bold text-on-surface">{goal.uom} Type</span>
             </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 border-t border-outline-variant flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sync Active</span>
           </div>
           <button 
             onClick={onClose}
             className="px-8 py-2.5 bg-on-surface text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all"
           >
             Close Detail View
           </button>
        </div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon, progress, trend, variant = 'default', action }: any) => (
  <div className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md relative overflow-hidden ${
    variant === 'error' ? 'bg-[#7F1D1D] border-red-900 text-white' : 'bg-surface-container-lowest border-outline-variant'
  }`}>
    {variant === 'error' && (
      <div className="absolute -right-4 -top-4 opacity-10">
        <AlertCircle className="w-32 h-32" />
      </div>
    )}
    <div className="flex justify-between items-start mb-6 relative z-10">
      <h3 className={`text-[12px] font-bold uppercase tracking-widest ${variant === 'error' ? 'text-white/80' : 'text-on-surface-variant'}`}>{title}</h3>
      <div className={`p-1.5 rounded-lg ${variant === 'error' ? 'bg-white/10' : 'bg-surface'}`}>{icon}</div>
    </div>
    
    <div className="flex items-end gap-6 relative z-10">
      <span className="text-4xl font-display font-bold leading-none tracking-tighter">{value}</span>
      {progress !== undefined && (
        <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden mb-1">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
        </div>
      )}
    </div>
    <p className={`text-[11px] font-medium mt-3 ${variant === 'error' ? 'text-white/70' : 'text-on-surface-variant'}`}>{subtitle}</p>
    
    {trend && <div className="mt-4 text-[10px] font-bold text-primary bg-primary/5 w-max px-2 py-0.5 rounded uppercase tracking-tighter">{trend}</div>}
    {action && (
       <button className="mt-4 bg-white text-error font-bold text-[11px] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-widest shadow-sm">
         {action}
       </button>
    )}
  </div>
);

const ComplianceRow = ({ name, dept, q1, q2, q3, q4, onAction, onViewGoals }: any) => (
  <tr className="hover:bg-surface transition-colors group">
    <td className="px-6 py-4 font-bold text-on-surface">{name}</td>
    <td className="px-6 py-4 text-on-surface-variant text-xs">{dept}</td>
    <td className="px-6 py-4 text-center">{q1 === 'done' ? <CheckCircle2 className="w-5 h-5 text-primary mx-auto" fill="currentColor" fillOpacity={0.1} /> : <div className="w-5 h-5 border-2 border-outline-variant/30 rounded-full mx-auto" />}</td>
    <td className="px-6 py-4 text-center">{q2 === 'done' ? <CheckCircle2 className="w-5 h-5 text-primary mx-auto" fill="currentColor" fillOpacity={0.1} /> : q2 === 'draft' ? <span className="text-[10px] font-bold bg-surface-dim px-2 py-0.5 rounded tracking-tighter uppercase">Draft</span> : <div className="w-5 h-5 border-2 border-outline-variant/30 rounded-full mx-auto" />}</td>
    <td className="px-6 py-4 text-center">{q3 === 'done' ? <CheckCircle2 className="w-5 h-5 text-primary mx-auto" fill="currentColor" fillOpacity={0.1} /> : q3 === 'draft' ? <span className="text-[10px] font-bold bg-surface-dim px-2 py-0.5 rounded tracking-tighter uppercase">Draft</span> : q3 === 'overdue' ? <span className="text-[10px] font-bold bg-error-container text-error px-2 py-0.5 rounded tracking-tighter uppercase border border-error/20">Overdue</span> : <div className="w-5 h-5 border-2 border-outline-variant/30 rounded-full mx-auto" />}</td>
    <td className="px-6 py-4 text-center"><div className="w-5 h-5 border-2 border-outline-variant/30 rounded-full mx-auto" /></td>
    <td className="px-6 py-4 text-right">
       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={onViewGoals}
           className="px-3 py-1 border border-primary/30 text-primary text-[10px] font-bold uppercase rounded-lg shadow-sm hover:bg-primary/5 transition-all"
         >
           View Goals
         </button>
         <button 
           onClick={onAction}
           className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-lg shadow-sm hover:shadow-md transition-all"
         >
           Audit
         </button>
         <button className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"><MoreHorizontal className="w-4 h-4" /></button>
       </div>
    </td>
  </tr>
);

const DistributionRow = ({ label, val, color, priority }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="w-36 text-right font-display text-xs font-bold text-on-surface-variant truncate" title={label}>{label}</div>
    <div className="flex-1 bg-surface-container-high rounded-full h-3 overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${color}`} />
    </div>
    <div className="w-12 text-left font-mono text-[11px] font-bold text-primary">{val}%</div>
  </div>
);

const PaginationButton = ({ label, icon, active = false, disabled = false }: any) => (
  <button 
    disabled={disabled}
    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
      active ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {icon ? React.cloneElement(icon as any, { size: 16 }) : label}
  </button>
);

import { Clock as ClockIcon } from 'lucide-react';
