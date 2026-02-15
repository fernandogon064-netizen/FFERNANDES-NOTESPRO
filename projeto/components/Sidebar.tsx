
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  StickyNote, 
  Target, 
  Plus, 
  X, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  BrainCircuit,
  Palette,
  Sun,
  Moon,
  Monitor,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
  Type,
  Cloud,
  Droplets,
  Flame,
  Layout,
  FileText,
  FileDown,
  Link as LinkIcon
} from 'lucide-react';
import { MonthlyGoal, Note } from '../types';
import { Theme, COLOR_PALETTES, FONT_OPTIONS } from '../App';
import { jsPDF } from 'jspdf';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  view: 'dashboard' | 'notes';
  setView: (view: 'dashboard' | 'notes') => void;
  monthlyGoals: MonthlyGoal[];
  toggleGoal: (id: string) => void;
  addGoal: (text: string) => void;
  removeGoal: (id: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColorIndex: number;
  setPrimaryColorIndex: (index: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  notes: Note[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  view, 
  setView, 
  monthlyGoals, 
  toggleGoal, 
  addGoal, 
  removeGoal,
  theme,
  setTheme,
  primaryColorIndex,
  setPrimaryColorIndex,
  fontFamily,
  setFontFamily,
  notes
}) => {
  const [newGoal, setNewGoal] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showFontList, setShowFontList] = useState(false);
  const [showThemeList, setShowThemeList] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    addGoal(newGoal);
    setNewGoal('');
  };

  const generatePDF = async () => {
    if (notes.length === 0) {
      alert("Crie algumas notas primeiro para gerar um relatório!");
      return;
    }

    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      
      notes.forEach((note, index) => {
        if (index > 0) {
          doc.addPage();
        }

        const timestamp = new Date().toLocaleString('pt-BR');
        
        // Header Style (Inicia em cada página)
        doc.setFillColor(15, 165, 233); 
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("FFernandes NotesPRO - PAINEL DE IDEIAS", 15, 18);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Exportado em: ${timestamp}`, 15, 28);
        doc.text(`Ideia #${index + 1} de ${notes.length}`, 160, 28);

        let yPos = 55;

        // Note title box
        doc.setFillColor(248, 250, 252);
        doc.rect(10, yPos - 5, 190, 12, 'F');
        
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(note.title, 15, yPos + 3);
        
        yPos += 18;

        // Meta info
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Categoria: ${note.category} | Prioridade: ${note.priority}`, 15, yPos);
        yPos += 12;

        // Clean Content
        const cleanContent = note.content.replace(urlRegex, '').trim();
        const linksInContent = note.content.match(urlRegex) || [];

        if (cleanContent) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          const splitContent = doc.splitTextToSize(cleanContent, 180);
          
          // Check if content fits, if not doc.addPage is handled naturally by jspdf splitText but we reset yPos
          doc.text(splitContent, 15, yPos);
          yPos += (splitContent.length * 6) + 12;
        }

        // Checklist
        if (note.checklist.length > 0) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text("LISTA DE TAREFAS:", 15, yPos);
          yPos += 8;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          
          note.checklist.forEach(item => {
            const status = item.completed ? "[X]" : "[ ]";
            doc.text(`${status} ${item.text}`, 20, yPos);
            yPos += 7;
          });
          yPos += 6;
        }

        // LINKS SECTION
        const allLinks = [
          ...(note.videoLink ? [note.videoLink] : []),
          ...(note.links || []),
          ...linksInContent
        ];
        const uniqueLinks = Array.from(new Set(allLinks));

        if (uniqueLinks.length > 0) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text("LINKS E REFERÊNCIAS:", 15, yPos);
          yPos += 8;
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");

          uniqueLinks.forEach((link) => {
            doc.setTextColor(0, 0, 255); 
            doc.text(link, 15, yPos, { url: link });
            
            const textWidth = doc.getTextWidth(link);
            doc.setDrawColor(0, 0, 255);
            doc.line(15, yPos + 0.8, 15 + textWidth, yPos + 0.8);
            yPos += 8;
          });
        }
      });

      doc.save(`FFNotesPRO-Relatorio-Completo.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Houve um erro na exportação.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-neutral-900 transition-all duration-400 ease-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      <div className="flex flex-col h-full">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative animate-float">
               <div className="absolute inset-0 bg-brand-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
               <div 
                className="relative w-11 h-11 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform duration-500"
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
               >
                  <BrainCircuit size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
               </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-extrabold text-lg tracking-tighter text-slate-900 dark:text-white">
                FFernandes
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] leading-none">
                Notes<span className="text-brand-500 font-bold ml-1 tracking-normal">PRO</span>
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-900 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-10 overflow-y-auto custom-scroll">
          <div>
            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4 pl-2">Menu</p>
            <div className="space-y-2">
              <button 
                onClick={() => { setView('notes'); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  view === 'notes' 
                  ? 'bg-brand-50 dark:bg-brand-400 text-brand-600 dark:text-black border border-brand-100 dark:border-brand-500 shadow-sm' 
                  : 'text-slate-900 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <StickyNote size={18} />
                  <span className={`text-sm font-semibold`}>Painel de Ideias</span>
                </div>
                {view === 'notes' && <ChevronRight size={14} className="text-brand-500 dark:text-black" />}
              </button>
              <button 
                onClick={() => { setView('dashboard'); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  view === 'dashboard' 
                  ? 'bg-brand-50 dark:bg-brand-400 text-brand-600 dark:text-black border border-brand-100 dark:border-brand-500 shadow-sm' 
                  : 'text-slate-900 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className={`text-sm font-semibold`}>Performance</span>
                </div>
                {view === 'dashboard' && <ChevronRight size={14} className="text-brand-500 dark:text-black" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pl-2 mb-4">
              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Metas do Dia</p>
              <Target size={14} className="text-slate-900 dark:text-white" />
            </div>
            
            <div className="space-y-4">
              <form onSubmit={handleAddGoal} className="relative group">
                <input 
                  type="text" 
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Novo objetivo..."
                  className="w-full bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-300/30 text-slate-900 dark:text-white placeholder-slate-400"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-600 dark:text-white opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <Plus size={16} />
                </button>
              </form>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scroll">
                {monthlyGoals.map(goal => (
                  <div key={goal.id} className="group flex items-start gap-3 text-xs">
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`mt-0.5 shrink-0 transition-colors ${goal.completed ? 'text-brand-600 dark:text-white' : 'text-slate-400 dark:text-neutral-700'}`}
                    >
                      {goal.completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                    </button>
                    <span className={`flex-1 transition-all font-medium ${goal.completed ? 'text-slate-400 dark:text-neutral-600 line-through' : 'text-slate-900 dark:text-white'}`}>
                      {goal.text}
                    </span>
                    <button 
                      onClick={() => removeGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-900 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 animate-in slide-in-from-left duration-500">
             <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4 pl-2 flex items-center gap-2">
                <FileText size={12} /> Relatórios
             </p>
             
             <button 
              onClick={generatePDF}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-brand-500 dark:bg-brand-400 text-white dark:text-black font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/20 dark:shadow-none ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
             >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FileDown size={18} />
                    <span>Exportar PDFS</span>
                  </>
                )}
             </button>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-neutral-900 space-y-4 bg-white dark:bg-[#0a0a0a]">
          <button 
            onClick={() => { setShowSettings(!showSettings); setShowFontList(false); setShowThemeList(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${
              showSettings 
              ? 'bg-brand-50 dark:bg-brand-400 border-brand-200 dark:border-brand-500 text-brand-600 dark:text-black' 
              : 'bg-transparent border-transparent text-slate-500 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon size={16} />
              <span className={`text-xs font-bold uppercase tracking-widest`}>Configurações</span>
            </div>
            {showSettings ? <ChevronUp size={14} className="dark:text-black" /> : <ChevronDown size={14} />}
          </button>

          {showSettings && (
            <div className="space-y-6 pt-2 animate-in slide-in-from-bottom-2 duration-300 max-h-[360px] overflow-y-auto custom-scroll pr-1">
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Palette size={12} /> Identidade Visual
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTES.map((palette, idx) => (
                    <button
                      key={palette.name}
                      onClick={() => setPrimaryColorIndex(idx)}
                      className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                        primaryColorIndex === idx ? 'border-slate-900 dark:border-white ring-2 ring-brand-500/20' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: palette.shades[5] }}
                      title={palette.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowFontList(!showFontList)}
                  className="w-full flex items-center justify-between group"
                >
                  <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group-hover:text-brand-500 transition-colors">
                    <Type size={12} /> Fontes
                  </p>
                  <div className="text-slate-400 dark:text-neutral-600">
                    {showFontList ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>
                </button>
                
                {showFontList && (
                  <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 duration-200">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => setFontFamily(font.family)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] text-center truncate transition-all ${
                          fontFamily === font.family 
                          ? 'bg-brand-500 text-white border-brand-600' 
                          : 'bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-200 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800'
                        }`}
                        style={{ fontFamily: font.family }}
                        title={font.name}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowThemeList(!showThemeList)}
                  className="w-full flex items-center justify-between group"
                >
                  <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group-hover:text-brand-500 transition-colors">
                    <Monitor size={12} /> Tema Interface
                  </p>
                  <div className="text-slate-400 dark:text-neutral-600">
                    {showThemeList ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>
                </button>
                
                {showThemeList && (
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-neutral-900/50 p-1 rounded-xl border border-slate-200 dark:border-neutral-800 animate-in slide-in-from-top-1 duration-200">
                    {[
                      { id: 'light', icon: <Sun size={12} /> },
                      { id: 'dark', icon: <Moon size={12} /> },
                      { id: 'black', icon: <BrainCircuit size={12} className="text-slate-900 dark:text-white" /> },
                      { id: 'system', icon: <Monitor size={12} /> },
                      { id: 'blue', icon: <Droplets size={12} className="text-blue-500" /> },
                      { id: 'red', icon: <Flame size={12} className="text-red-500" /> },
                      { id: 'gray', icon: <Cloud size={12} className="text-slate-400" /> }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as Theme)}
                        className={`flex items-center justify-center py-2.5 rounded-lg transition-all ${
                          theme === t.id 
                          ? 'bg-white dark:bg-brand-400 text-brand-600 dark:text-black shadow-sm ring-1 ring-brand-500/20' 
                          : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'
                        }`}
                        title={t.id}
                      >
                        {t.icon}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
