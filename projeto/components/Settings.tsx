
import React from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Check,
  Paintbrush,
  BrainCircuit
} from 'lucide-react';
import { Theme, COLOR_PALETTES } from '../App';

interface SettingsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColorIndex: number;
  setPrimaryColorIndex: (index: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  theme, 
  setTheme, 
  primaryColorIndex, 
  setPrimaryColorIndex 
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* Theme Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
            <Monitor size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Aparência do Sistema</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-600 font-medium">Escolha como o FFernandes NotesPRO deve se parecer para você.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { id: 'light', label: 'Modo Claro', icon: <Sun size={24} />, description: 'Interface clássica e limpa' },
            { id: 'dark', label: 'Modo Escuro', icon: <Moon size={24} />, description: 'Foco e economia de energia' },
            { id: 'system', label: 'Automático', icon: <Monitor size={24} />, description: 'Sincroniza com o seu dispositivo' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as Theme)}
              className={`flex flex-col items-center text-center p-8 rounded-[2rem] border-2 transition-all duration-300 relative group ${
                theme === t.id 
                ? 'bg-brand-50 dark:bg-brand-400/5 border-brand-500 shadow-xl shadow-brand-500/10' 
                : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-neutral-900 hover:border-slate-300 dark:hover:border-neutral-800'
              }`}
            >
              <div className={`mb-4 p-4 rounded-2xl transition-colors ${
                theme === t.id ? 'bg-brand-500 text-white' : 'bg-slate-50 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 group-hover:text-brand-500'
              }`}>
                {t.icon}
              </div>
              <span className={`text-sm font-bold mb-1 ${theme === t.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-neutral-600'}`}>{t.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-700 font-medium">{t.description}</span>
              
              {theme === t.id && (
                <div className="absolute top-4 right-4 bg-brand-500 text-white p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Personalization Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
            <Palette size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Identidade Visual</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-600 font-medium">Defina a cor principal que guiará sua navegação.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-slate-200 dark:border-neutral-900">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {COLOR_PALETTES.map((palette, idx) => (
              <button
                key={palette.name}
                onClick={() => setPrimaryColorIndex(idx)}
                className={`flex flex-col items-center gap-4 group relative`}
              >
                <div 
                  className={`w-14 h-14 rounded-2xl transition-all duration-300 shadow-lg ${
                    primaryColorIndex === idx 
                    ? 'scale-110 ring-4 ring-offset-4 ring-slate-900 dark:ring-white dark:ring-offset-[#0a0a0a]' 
                    : 'hover:scale-105 group-hover:shadow-xl'
                  }`}
                  style={{ backgroundColor: palette.shades[5] }}
                />
                <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${
                  primaryColorIndex === idx ? 'text-brand-500' : 'text-slate-500 dark:text-neutral-600'
                }`}>
                  {palette.name}
                </span>
                
                {primaryColorIndex === idx && (
                  <div className="absolute -top-1 -right-1 bg-slate-900 dark:bg-white text-white dark:text-black p-1 rounded-lg border-2 border-white dark:border-[#0a0a0a]">
                    <Paintbrush size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Info Card with Updated Logo Style */}
      <div className="glass-card bg-gradient-to-br from-brand-400 to-brand-600 dark:from-brand-500/20 dark:to-brand-500/5 p-10 rounded-[2.5rem] border border-brand-100 dark:border-brand-400/20 text-center relative overflow-hidden">
         <div className="relative z-10 flex flex-col items-center">
            <div className="relative animate-float mb-6">
              <div className="absolute inset-0 bg-white blur-xl opacity-20"></div>
              <div 
                className="relative w-16 h-16 bg-white flex items-center justify-center shadow-2xl"
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
              >
                <BrainCircuit size={32} className="text-brand-500 drop-shadow-[0_0_12px_rgba(14,165,233,0.5)]" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tighter">FFernandes Notes<span className="text-brand-500 font-bold ml-1">PRO</span></h3>
            <p className="text-sm text-brand-50/80 dark:text-brand-100/70 font-medium max-w-md mx-auto">
              Sua produtividade é nossa prioridade. Estas configurações são salvas automaticamente no seu navegador para manter sua identidade visual intacta.
            </p>
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
           <BrainCircuit size={300} className="text-white" />
         </div>
      </div>
    </div>
  );
};

export default Settings;
