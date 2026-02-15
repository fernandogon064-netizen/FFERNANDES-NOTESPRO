
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  CheckSquare,
  Square,
  Calendar,
  Pencil,
  Palette,
  Type,
  Link as LinkIcon,
  Video
} from 'lucide-react';
import { Category, Priority, Note, ChecklistItem } from '../types';
import DrawingModal from './DrawingModal';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Note) => void;
  editingNote?: Note;
  onImagePreview?: (imageUrl: string) => void;
}

const NOTE_COLORS = [
  { name: 'Padrão', value: 'transparent' },
  { name: 'Céu', value: '#0ea5e9' },
  { name: 'Rosa', value: '#f43f5e' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Âmbar', value: '#f59e0b' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Laranja', value: '#f97316' },
];

const FONT_SIZES = [
  { label: 'Pequeno', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Médio', value: '4' },
  { label: 'Grande', value: '5' },
  { label: 'Extra G', value: '6' },
  { label: 'Título', value: '7' },
];

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSubmit, editingNote, onImagePreview }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [category, setCategory] = useState<Category>(Category.OUTROS);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIA);
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [videoLink, setVideoLink] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedColor, setSelectedColor] = useState('transparent');
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  useEffect(() => {
    if (editingNote) {
      if (titleRef.current) titleRef.current.innerHTML = editingNote.title;
      if (contentRef.current) contentRef.current.innerHTML = editingNote.content;
      setCategory(editingNote.category);
      setPriority(editingNote.priority);
      setDeadline(editingNote.deadline || '');
      setImage(editingNote.image);
      setVideoLink(editingNote.videoLink || '');
      setLinks(editingNote.links || []);
      setChecklist(editingNote.checklist || []);
      setSelectedColor(editingNote.color || 'transparent');
    }
  }, [editingNote, isOpen]);

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value || undefined);
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = titleRef.current?.innerHTML || '';
    if (!titleVal.replace(/<[^>]*>?/gm, '').trim()) return;

    onSubmit({
      id: editingNote?.id || Date.now().toString(),
      title: titleVal,
      content: contentRef.current?.innerHTML || '',
      category,
      priority,
      dateCreated: editingNote?.dateCreated || new Date().toISOString(),
      deadline: deadline || undefined,
      image,
      videoLink: videoLink || undefined,
      links,
      checklist,
      isPinned: editingNote?.isPinned || false,
      color: selectedColor === 'transparent' ? undefined : selectedColor,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/90 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-neutral-900 rounded-[2.5rem] p-8 md:p-12 animate-in fade-in zoom-in duration-300 shadow-2xl">
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Registro de Ideia <span className="text-brand-500">PRO</span></h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><X size={28} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Coluna de Texto */}
              <div className="space-y-8">
                {/* Título Principal */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em]">Título Principal</label>
                  </div>
                  <div ref={titleRef} contentEditable className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 min-h-[50px] rich-content" />
                </div>

                {/* Desenvolvimento */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em]">Desenvolvimento</label>
                  </div>
                  <div ref={contentRef} contentEditable className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-5 text-slate-800 dark:text-neutral-300 focus:outline-none focus:border-brand-500 min-h-[200px] leading-relaxed rich-content" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contexto</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold">
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Prioridade</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold">
                      {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Coluna de Mídia e Checklist */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2"><ImageIcon size={14}/> Thumbnail</label>
                    <button type="button" onClick={() => setIsDrawingModalOpen(true)} className="text-[10px] font-bold text-brand-500 hover:underline">Desenhar</button>
                  </div>
                  <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-neutral-800 flex items-center justify-center bg-slate-50 dark:bg-neutral-950/30 overflow-hidden relative group">
                    {image ? (
                      <div className="w-full h-full relative">
                        <img src={image} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setImage(undefined)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-1">
                        <Plus size={20} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Anexar</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Video size={14}/> Vídeo Referência</label>
                  <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs" placeholder="Link YouTube/Vimeo" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><LinkIcon size={14}/> Links Úteis</label>
                  <div className="flex gap-2 mb-3">
                    <input type="url" value={newLink} onChange={(e) => setNewLink(e.target.value)} className="flex-1 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-xs" placeholder="https://..." />
                    <button type="button" onClick={addLink} className="bg-brand-500 text-white p-2 rounded-xl"><Plus size={18}/></button>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-2 custom-scroll">
                    {links.map((l, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-neutral-900 rounded-lg group">
                        <span className="text-[10px] font-medium truncate flex-1">{l}</span>
                        <button type="button" onClick={() => setLinks(links.filter((_, idx) => idx !== i))} className="text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CheckSquare size={14}/> Checklist</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} className="flex-1 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-xs" placeholder="Nova tarefa..." />
                    <button type="button" onClick={() => { if(newItem.trim()) { setChecklist([...checklist, { id: Date.now().toString(), text: newItem, completed: false }]); setNewItem(''); } }} className="bg-slate-200 dark:bg-neutral-800 p-2 rounded-xl"><Plus size={18}/></button>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-2 custom-scroll">
                    {checklist.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <button type="button" onClick={() => setChecklist(checklist.map(i => i.id === item.id ? {...i, completed: !i.completed} : i))}>{item.completed ? <CheckSquare size={16} className="text-brand-500"/> : <Square size={16} className="text-slate-300"/>}</button>
                        <span className={`text-[11px] font-bold ${item.completed ? 'line-through text-slate-400' : ''}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3"><Calendar size={14} className="inline mr-2"/> Prazo</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-slate-100 dark:border-neutral-900">
              <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Cancelar</button>
              <button type="submit" className="bg-brand-600 dark:bg-brand-400 text-white dark:text-neutral-950 px-10 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-500/20 active:scale-95 transition-all">Salvar Ideia</button>
            </div>
          </form>
        </div>
      </div>

      <DrawingModal isOpen={isDrawingModalOpen} onClose={() => setIsDrawingModalOpen(false)} onSave={(data) => setImage(data)} />
    </>
  );
};

export default NoteModal;
