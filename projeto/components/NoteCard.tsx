
import React from 'react';
import { 
  Pin, 
  PinOff, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Video, 
  CheckSquare, 
  Square,
  Maximize2,
  Link as LinkIcon,
  FileDown
} from 'lucide-react';
import { Note, Priority } from '../types';
import { jsPDF } from 'jspdf';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (note: Note) => void;
  onImageClick?: (imageUrl: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onTogglePin, onEdit, onImageClick }) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.ALTA: return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case Priority.MEDIA: return 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20';
      case Priority.BAIXA: return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      default: return 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-neutral-400 border-slate-200 dark:border-neutral-700';
    }
  };

  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline break-all font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const generateSinglePDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const doc = new jsPDF();
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const timestamp = new Date().toLocaleString('pt-BR');
      
      // Header Style
      doc.setFillColor(15, 165, 233); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("FF NOTES - EXPORTAÇÃO INDIVIDUAL", 15, 18);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Documento gerado em: ${timestamp}`, 15, 28);

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

      // Content
      const cleanContent = note.content.replace(urlRegex, '').trim();
      const linksInContent = note.content.match(urlRegex) || [];

      if (cleanContent) {
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const splitContent = doc.splitTextToSize(cleanContent, 180);
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
        
        note.checklist.forEach(item => {
          const status = item.completed ? "[X]" : "[ ]";
          doc.text(`${status} ${item.text}`, 20, yPos);
          yPos += 7;
        });
        yPos += 10;
      }

      // Links
      const allLinks = [
        ...(note.videoLink ? [note.videoLink] : []),
        ...(note.links || []),
        ...linksInContent
      ];
      const uniqueLinks = Array.from(new Set(allLinks));

      if (uniqueLinks.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("REFERÊNCIAS:", 15, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 255);
        uniqueLinks.forEach((link) => {
          doc.text(link, 15, yPos, { url: link });
          yPos += 8;
        });
      }

      doc.save(`Ideia-${note.title.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF individual:", err);
      alert("Erro ao exportar.");
    }
  };

  const completedTasks = note.checklist.filter(i => i.completed).length;

  const cardStyle: React.CSSProperties = note.color && note.color !== 'transparent' ? {
    borderTop: `6px solid ${note.color}`,
    boxShadow: `0 4px 20px -5px ${note.color}40`
  } : {};

  return (
    <div 
      className={`glass-card bg-white dark:bg-[#141414] rounded-3xl overflow-hidden transition-all duration-300 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] flex flex-col group border border-slate-200 dark:border-neutral-900 shadow-sm dark:shadow-none ${note.isPinned ? 'border-brand-600/30 dark:border-brand-300/30 ring-1 ring-brand-500/10' : ''}`}
      style={cardStyle}
    >
      {note.image && (
        <div 
          className="w-full h-44 overflow-hidden relative border-b border-slate-100 dark:border-neutral-900 cursor-pointer group/img"
          onClick={() => onImageClick?.(note.image!)}
        >
          <img 
            src={note.image} 
            alt={note.title} 
            className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-110" 
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="text-white drop-shadow-lg" size={32} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#141414] via-transparent to-transparent opacity-40"></div>
        </div>
      )}
      
      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <span className={`text-[9px] uppercase font-bold tracking-[0.15em] px-2.5 py-1 rounded-lg border ${getPriorityColor(note.priority)}`}>
            {note.priority}
          </span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={generateSinglePDF} title="Exportar PDF" className="text-slate-400 dark:text-neutral-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FileDown size={17} />
            </button>
            <button onClick={() => onTogglePin(note.id)} className={`${note.isPinned ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-neutral-600'} hover:text-brand-700 dark:hover:text-brand-200 transition-colors`}>
              {note.isPinned ? <Pin size={17} /> : <PinOff size={17} />}
            </button>
            <button onClick={() => onEdit(note)} className="text-slate-400 dark:text-neutral-600 hover:text-black dark:hover:text-white transition-colors">
              <Edit3 size={17} />
            </button>
            <button onClick={() => onDelete(note.id)} className="text-slate-400 dark:text-neutral-600 hover:text-red-700 dark:hover:text-red-400 transition-colors">
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-200 transition-colors">
          {note.title}
        </h3>
        
        <div 
          style={{ 
            fontWeight: note.isBold ? '900' : '400',
            fontSize: note.fontSize || '14px'
          }}
          className="text-slate-700 dark:text-slate-300 mb-6 line-clamp-4 leading-relaxed whitespace-pre-wrap"
        >
          {renderContentWithLinks(note.content)}
        </div>

        {note.checklist.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              <span>Atividades</span>
              <span className="text-brand-600 dark:text-brand-400">{completedTasks}/{note.checklist.length}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1 rounded-full mb-4">
              <div 
                className="bg-brand-600 dark:bg-brand-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(completedTasks / note.checklist.length) * 100}%`, backgroundColor: note.color && note.color !== 'transparent' ? note.color : undefined }}
              />
            </div>
            <div className="space-y-2">
              {note.checklist.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-400">
                  {item.completed ? <CheckSquare size={14} className="text-brand-600 dark:text-brand-400" style={{ color: note.color && note.color !== 'transparent' ? note.color : undefined }} /> : <Square size={14} className="text-slate-300 dark:text-neutral-700" />}
                  <span className={item.completed ? 'line-through text-slate-400 dark:text-neutral-600' : 'font-medium'}>{item.text}</span>
                </div>
              ))}
              {note.checklist.length > 2 && (
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 pl-7 mt-1 italic">+{note.checklist.length - 2} itens</p>
              )}
            </div>
          </div>
        )}

        {/* Links do Card */}
        {(note.videoLink || (note.links && note.links.length > 0)) && (
          <div className="mb-6 pt-4 border-t border-slate-100 dark:border-neutral-900/50">
             <div className="space-y-2 overflow-hidden">
                {note.videoLink && (
                  <a 
                    href={note.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline truncate font-bold"
                  >
                    <LinkIcon size={12} /> Vídeo de Referência
                  </a>
                )}
                {note.links && note.links.map((link, idx) => (
                   <a 
                    key={idx}
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline truncate font-bold"
                  >
                    <LinkIcon size={12} /> {link.replace(/^https?:\/\//, '')}
                  </a>
                ))}
             </div>
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between">
          <div className="flex gap-2 text-slate-400 dark:text-neutral-600">
             {note.videoLink && <Video size={14} />}
             {note.links && note.links.length > 0 && <ExternalLink size={14} />}
          </div>
          <div className="flex items-center gap-4">
            {note.deadline && (
              <span className={`text-[10px] font-bold ${new Date(note.deadline) < new Date() ? 'text-red-500' : 'text-slate-500 dark:text-neutral-500'}`}>
                {new Date(note.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-brand-500/10 dark:bg-brand-400/20 text-[10px] font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">{note.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
