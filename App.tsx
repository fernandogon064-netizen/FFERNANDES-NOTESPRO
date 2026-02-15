
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Menu, 
  StickyNote,
  BrainCircuit,
  FilterX,
  X,
  Download
} from 'lucide-react';
import { Category, Note, MonthlyGoal, Priority } from './types';

// Components
import Sidebar from './components/Sidebar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import DashboardStats from './components/DashboardStats';

export type Theme = 'light' | 'dark' | 'system' | 'blue' | 'red' | 'gray' | 'black';

// Export AppFontSize type to resolve the import error in components/Sidebar.tsx
export type AppFontSize = 'small' | 'normal' | 'medium' | 'large';

export const COLOR_PALETTES = [
  { name: 'Baby Blue', shades: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'] },
  { name: 'Emerald', shades: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669'] },
  { name: 'Rose', shades: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48'] },
  { name: 'Red', shades: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626'] },
  { name: 'Amber', shades: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'] },
  { name: 'Violet', shades: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'] },
  { name: 'Indigo', shades: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5'] },
  { name: 'Slate', shades: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569'] },
  { name: 'Azul Real', shades: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'] },
  { name: 'Vermelho Vivo', shades: ['#fff1f1', '#ffe4e4', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626'] },
  { name: 'Cinza Claro', shades: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'] },
  { name: 'Laranja', shades: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c'] },
  { name: 'Marrom', shades: ['#fdf8f6', '#f5e9e2', '#ecd9cd', '#dbbfad', '#c89d84', '#a7826a', '#8d6a53'] },
];

export const FONT_OPTIONS = [
  // Classic Sans
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Quicksand', family: "'Quicksand', sans-serif" },
  { name: 'Josefin', family: "'Josefin Sans', sans-serif" },
  // Serif & Display
  { name: 'Playfair', family: "'Playfair Display', serif" },
  { name: 'Lora', family: "'Lora', serif" },
  { name: 'Merriweather', family: "'Merriweather', serif" },
  { name: 'Cormorant', family: "'Cormorant Garamond', serif" },
  { name: 'Abril', family: "'Abril Fatface', cursive" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Bebas', family: "'Bebas Neue', cursive" },
  // Handwritten & Artistic
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Dancing', family: "'Dancing Script', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Great Vibes', family: "'Great Vibes', cursive" },
  // Monospace
  { name: 'Mono Code', family: "'Source Code Pro', monospace" },
  { name: 'Typewriter', family: "'Courier Prime', monospace" },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('fp_theme') as Theme) || 'system';
  });

  const [primaryColorIndex, setPrimaryColorIndex] = useState<number>(() => {
    const saved = localStorage.getItem('fp_primary_color_index');
    return saved ? parseInt(saved) : 0;
  });

  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('fp_font_family') || FONT_OPTIONS[0].family;
  });

  // State to manage application font size
  const [appFontSize, setAppFontSize] = useState<AppFontSize>(() => {
    return (localStorage.getItem('fp_app_font_size') as AppFontSize) || 'normal';
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('fp_notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(() => {
    const saved = localStorage.getItem('fp_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Finalizar MVP do projeto principal', completed: false },
      { id: '2', text: 'Gravar 4 vídeos para o canal', completed: true },
      { id: '3', text: 'Ler 2 livros técnicos', completed: false }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [deadlineOnly, setDeadlineOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'notes'>('notes');
  const [fullscreenImage, setFullscreenImage] = useState<string | undefined>();

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('fp_theme', theme);

    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove('light', 'dark', 'theme-blue', 'theme-red', 'theme-gray', 'theme-black');
      
      if (currentTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else if (['blue', 'red', 'gray'].includes(currentTheme)) {
        root.classList.add('light'); 
        root.classList.add(`theme-${currentTheme}`);
      } else if (currentTheme === 'black') {
        root.classList.add('dark'); 
        root.classList.add('theme-black');
      } else {
        root.classList.add(currentTheme);
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fp_primary_color_index', primaryColorIndex.toString());
    const shades = COLOR_PALETTES[primaryColorIndex].shades;
    const root = document.documentElement;
    
    shades.forEach((shade, i) => {
      const step = i === 0 ? 50 : i * 100;
      root.style.setProperty(`--brand-${step}`, shade);
    });
  }, [primaryColorIndex]);

  useEffect(() => {
    localStorage.setItem('fp_font_family', fontFamily);
    document.documentElement.style.setProperty('--user-font', fontFamily);
  }, [fontFamily]);

  // Persist app font size and apply an attribute to document root for CSS scaling
  useEffect(() => {
    localStorage.setItem('fp_app_font_size', appFontSize);
    document.documentElement.setAttribute('data-font-size', appFontSize);
  }, [appFontSize]);

  useEffect(() => {
    localStorage.setItem('fp_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('fp_goals', JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
        const matchesPriority = priorityFilter === 'All' || note.priority === priorityFilter;
        const matchesDeadline = !deadlineOnly || !!note.deadline;
        return matchesSearch && matchesCategory && matchesPriority && matchesDeadline;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      });
  }, [notes, searchTerm, selectedCategory, priorityFilter, deadlineOnly]);

  const handleAddNote = (newNote: Note) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? newNote : n));
    } else {
      setNotes(prev => [newNote, ...prev]);
    }
    setIsModalOpen(false);
    setEditingNote(undefined);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const toggleGoal = (id: string) => {
    setMonthlyGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addGoal = (text: string) => {
    setMonthlyGoals(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
  };

  const removeGoal = (id: string) => {
    setMonthlyGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleDashboardFilter = (type: 'category' | 'priority' | 'deadline', value: string) => {
    clearFilters();
    if (type === 'category') {
      setSelectedCategory(value);
    } else if (type === 'priority') {
      setPriorityFilter(value as Priority);
    } else if (type === 'deadline') {
      setDeadlineOnly(true);
    }
    setView('notes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriorityFilter('All');
    setDeadlineOnly(false);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || priorityFilter !== 'All' || deadlineOnly || searchTerm !== '';

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/80 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        view={view}
        setView={(newView) => {
          setView(newView);
          if (newView === 'notes') clearFilters();
        }}
        monthlyGoals={monthlyGoals}
        toggleGoal={toggleGoal}
        addGoal={addGoal}
        removeGoal={removeGoal}
        theme={theme}
        setTheme={setTheme}
        primaryColorIndex={primaryColorIndex}
        setPrimaryColorIndex={setPrimaryColorIndex}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        appFontSize={appFontSize}
        setAppFontSize={setAppFontSize}
        notes={notes}
      />

      <main className="flex-1 w-full lg:ml-72 min-h-screen p-4 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-brand-600 dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative animate-float">
                <div className="absolute inset-0 bg-brand-500 blur-md opacity-30"></div>
                <div 
                  className="relative w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-xl rotate-3"
                  style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
                >
                  <BrainCircuit size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-extrabold flex items-center gap-1.5 text-slate-900 dark:text-white tracking-tight`}>
                  {view === 'dashboard' ? (
                    'Performance'
                  ) : (
                    <>
                      <span className="md:hidden relative mr-1">
                        <BrainCircuit size={20} className="text-brand-500 relative z-10" />
                      </span>
                      FFernandes Notes<span className="text-brand-500 font-bold ml-1">PRO</span>
                    </>
                  )}
                </h1>
                <p className="text-slate-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-0.5">Minimalist Workspace</p>
              </div>
            </div>
          </div>

          {view === 'notes' && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar ideias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:border-brand-500 transition-all text-sm shadow-sm dark:shadow-none placeholder-slate-400 dark:text-white"
                />
              </div>
              <button 
                onClick={() => { setEditingNote(undefined); setIsModalOpen(true); }}
                className="bg-brand-500 hover:bg-brand-600 text-white p-3 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-brand-500/20 active:scale-95"
                title="Nova Idea"
              >
                <Plus size={22} />
              </button>
            </div>
          )}
        </header>

        {view === 'dashboard' ? (
          <DashboardStats notes={notes} monthlyGoals={monthlyGoals} onFilter={handleDashboardFilter} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                {['All', ...Object.values(Category)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPriorityFilter('All'); setDeadlineOnly(false); }}
                    className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                      selectedCategory === cat 
                      ? 'bg-brand-500 dark:bg-brand-400 border-brand-600 dark:border-brand-500 text-white dark:text-black shadow-md' 
                      : 'bg-white dark:bg-transparent border-slate-300 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-400 dark:hover:border-neutral-700 shadow-sm dark:shadow-none'
                    }`}
                  >
                    {cat === 'All' ? 'Geral' : cat}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <FilterX size={14} /> Limpar Filtros
                </button>
              )}
            </div>

            {(priorityFilter !== 'All' || deadlineOnly) && (
              <div className="mb-6 flex flex-wrap items-center gap-3 animate-in slide-in-from-left duration-300">
                <span className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">Filtrando por:</span>
                {priorityFilter !== 'All' && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-red-200 dark:border-red-900/50">
                    Prioridade {priorityFilter}
                  </span>
                )}
                {deadlineOnly && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-yellow-200 dark:border-yellow-900/50">
                    Com Prazos
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                    onEdit={handleEditNote}
                    onImageClick={(url) => setFullscreenImage(url)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 dark:text-neutral-600">
                  <StickyNote size={54} className="mb-6 opacity-20" />
                  <p className="font-medium">Nenhuma ideia encontrada com os filtros atuais.</p>
                  {hasActiveFilters && (
                    <button 
                      onClick={clearFilters}
                      className="mt-4 text-brand-500 dark:text-brand-300 text-sm font-semibold hover:underline"
                    >
                      Mostrar tudo
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {isModalOpen && (
        <NoteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddNote}
          editingNote={editingNote}
          onImagePreview={(url) => setFullscreenImage(url)}
        />
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setFullscreenImage(undefined)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <img 
              src={fullscreenImage} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute top-0 right-0 p-4 flex gap-4">
               <a 
                href={fullscreenImage} 
                download="FFNOTES-Ideia.png"
                className="bg-brand-300 hover:bg-brand-400 text-black p-3 rounded-full transition-all shadow-lg hover:scale-110 active:scale-90"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={20} />
              </a>
              <button 
                onClick={() => setFullscreenImage(undefined)}
                className="bg-brand-300 hover:bg-brand-400 text-black p-3 rounded-full transition-all shadow-lg hover:scale-110 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
