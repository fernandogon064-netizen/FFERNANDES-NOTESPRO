
import React, { useMemo } from 'react';
import { 
  ComposedChart,
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LabelList,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Target, 
  CheckCircle2, 
  Calendar,
  Layers, 
  Zap, 
  Clock,
  Layout
} from 'lucide-react';
import { Note, Category, Priority, MonthlyGoal } from '../types';

interface DashboardStatsProps {
  notes: Note[];
  monthlyGoals: MonthlyGoal[];
  onFilter: (type: 'category' | 'priority' | 'deadline', value: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ notes, monthlyGoals, onFilter }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const categoryProgressData = useMemo(() => {
    return Object.values(Category).map(cat => {
      const catNotes = notes.filter(n => n.category === cat);
      let totalItems = 0;
      let completedItems = 0;
      
      catNotes.forEach(note => {
        totalItems += note.checklist.length;
        completedItems += note.checklist.filter(i => i.completed).length;
      });

      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      return {
        name: cat.substring(0, 3).toLowerCase(),
        fullName: cat,
        progress: progress,
        count: catNotes.length
      };
    }).filter(c => c.count > 0);
  }, [notes]);

  const priorityData = useMemo(() => {
    const total = notes.length;
    return Object.values(Priority).map(p => {
      const count = notes.filter(n => n.priority === p).length;
      return {
        name: p,
        value: count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0
      };
    });
  }, [notes]);

  const goalsProgress = useMemo(() => {
    if (monthlyGoals.length === 0) return 0;
    const completed = monthlyGoals.filter(g => g.completed).length;
    return Math.round((completed / monthlyGoals.length) * 100);
  }, [monthlyGoals]);

  const radialData = [
    {
      name: 'Progresso',
      value: goalsProgress,
      fill: 'var(--brand-500)',
    },
  ];

  const totalTasks = notes.reduce((acc, curr) => acc + curr.checklist.length, 0);
  const completedTasks = notes.reduce((acc, curr) => acc + curr.checklist.filter(i => i.completed).length, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    border: isDarkMode ? '1px solid #333' : '1px solid #cbd5e1',
    borderRadius: '12px',
    color: isDarkMode ? '#fff' : '#0f172a',
    fontSize: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
  };

  const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim();
  const brandLightColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-300').trim();

  const priorityColors = isDarkMode 
    ? ['#4ade80', '#fb923c', '#f87171'] 
    : ['#10b981', '#f97316', '#ef4444'];

  const stats = [
    { 
      id: 'total',
      icon: <Layers size={22} />, 
      label: 'Total Ideias', 
      value: notes.length, 
      color: 'text-brand-500 dark:text-white', 
      bg: 'bg-brand-50 dark:bg-neutral-900/50',
      hover: 'hover:border-brand-300',
      onClick: () => onFilter('category', 'All')
    },
    { 
      id: 'urgent',
      icon: <Zap size={22} />, 
      label: 'Urgentes', 
      value: notes.filter(n => n.priority === Priority.ALTA).length, 
      color: 'text-red-500 dark:text-red-400', 
      bg: 'bg-red-50 dark:bg-neutral-900/50',
      hover: 'hover:border-red-400',
      onClick: () => onFilter('priority', Priority.ALTA)
    },
    { 
      id: 'execution',
      icon: <CheckCircle2 size={22} />, 
      label: 'Execução', 
      value: `${completionRate}%`, 
      color: 'text-green-500 dark:text-green-400', 
      bg: 'bg-green-50 dark:bg-neutral-900/50',
      hover: '',
      onClick: null
    },
    { 
      id: 'deadlines',
      icon: <Clock size={22} />, 
      label: 'Com Prazos', 
      value: notes.filter(n => n.deadline).length, 
      color: 'text-yellow-500 dark:text-yellow-400', 
      bg: 'bg-yellow-50 dark:bg-neutral-900/50',
      hover: 'hover:border-yellow-400',
      onClick: () => onFilter('deadline', 'All')
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={stat.onClick || undefined}
            className={`glass-card bg-white dark:bg-[#141414] p-7 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm dark:shadow-none transition-all duration-300 ${stat.onClick ? `cursor-pointer ${stat.hover} hover:scale-[1.02] active:scale-[0.98]` : ''}`}
          >
            <div className={`p-3 w-fit rounded-xl mb-5 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h4 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tighter">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 glass-card bg-gradient-to-br from-brand-300 to-brand-400 dark:from-brand-500/20 dark:from-brand-500/10 p-8 lg:p-10 rounded-[2.5rem] border border-brand-100 dark:border-brand-400/20 shadow-xl shadow-brand-200/50 dark:shadow-none overflow-hidden relative">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-black flex items-center gap-3">
                Performance por Categoria
              </h3>
              <p className="text-xs text-slate-700/70 dark:text-black/60 font-medium">Clique em uma barra para ver as ideias</p>
            </div>
          </div>
          
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={categoryProgressData}>
                <defs>
                  <linearGradient id="imageBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={brandLightColor} />
                    <stop offset="100%" stopColor={brandColor} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="0" 
                  stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  tick={{ fill: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.6)' }}
                />
                <YAxis 
                  stroke={isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]} 
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.6)' }}
                />
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  formatter={(value: any) => [`${value}%`, 'Execução']}
                />
                <Bar 
                  dataKey="progress" 
                  fill="url(#imageBarGradient)" 
                  barSize={32}
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => onFilter('category', data.fullName)}
                  cursor="pointer"
                />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke={isDarkMode ? "#ffffff" : "#0f172a"} 
                  strokeWidth={2}
                  dot={{ r: 4, fill: isDarkMode ? '#ffffff' : '#0f172a', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: isDarkMode ? '#ffffff' : '#0f172a', strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card bg-white dark:bg-[#141414] p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-neutral-900 shadow-sm dark:shadow-none flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3 w-full">
            <Layout size={18} className="text-brand-500" />
            Metas do Dia
          </h3>
          
          <div className="h-60 w-full relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={12} 
                data={radialData}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar
                  background={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-slate-900 dark:text-white leading-none">{goalsProgress}%</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-white uppercase tracking-widest mt-2">Concluído</span>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-center text-slate-500 dark:text-white/60 font-medium">
            {monthlyGoals.filter(g => g.completed).length} de {monthlyGoals.length} objetivos realizados hoje.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="glass-card bg-gradient-to-br from-brand-300 to-brand-400 dark:from-brand-500/20 dark:to-brand-500/10 p-8 lg:p-10 rounded-[2.5rem] border border-brand-100 dark:border-brand-400/20 shadow-xl shadow-brand-200/50 dark:shadow-none overflow-hidden relative">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <Target size={18} className="text-slate-900 dark:text-white" />
            Nível de Prioridades
          </h3>
          <div className="h-72 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                  onClick={(data) => onFilter('priority', data.name)}
                  cursor="pointer"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                  ))}
                  <LabelList 
                    dataKey="percent" 
                    position="outside" 
                    formatter={(val: number) => val > 0 ? `${val}%` : ''} 
                    fill={isDarkMode ? '#ffffff' : '#0f172a'}
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name, props: any) => [`${value} ideias (${props.payload.percent}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/3 space-y-4">
              {priorityData.map((p, idx) => (
                <div 
                  key={p.name} 
                  className="flex flex-col gap-1 cursor-pointer group"
                  onClick={() => onFilter('priority', p.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: priorityColors[idx % priorityColors.length] }} />
                    <span className="text-xs font-bold text-slate-700 dark:text-white group-hover:text-brand-500 transition-colors">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 ml-5">{p.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-brand-300 to-brand-400 dark:from-brand-500/20 dark:to-brand-500/10 p-8 lg:p-10 rounded-[2.5rem] border border-brand-100 dark:border-brand-400/20 shadow-xl shadow-brand-200/50 dark:shadow-none overflow-hidden relative">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <Calendar size={18} className="text-slate-900 dark:text-white" />
            Frequência de Novos Projetos
          </h3>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={notes.slice(-8).map((n, i) => ({ name: `Nº ${i+1}`, val: n.checklist.length }))}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={brandLightColor} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={brandLightColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={tooltipStyle} />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke={isDarkMode ? "#ffffff" : brandColor} 
                  strokeWidth={3} 
                  fill="url(#areaGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
