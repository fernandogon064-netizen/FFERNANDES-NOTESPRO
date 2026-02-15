
import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Pencil, Trash2, Check, RotateCcw } from 'lucide-react';

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
}

const DrawingModal: React.FC<DrawingModalProps> = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('var(--brand-500)'); // Default to current brand primary
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  // Function to initialize and resize canvas
  const initCanvas = () => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    // Save current drawing if any
    const tempImage = canvas.toDataURL();
    
    // Set canvas dimensions to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Restore drawing after resize if it's not the first init
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = tempImage;
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure container is rendered and has dimensions
      const timer = setTimeout(() => {
        initCanvas();
      }, 100);
      
      window.addEventListener('resize', initCanvas);
      return () => {
        window.removeEventListener('resize', initCanvas);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color === 'var(--brand-500)' ? getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim() : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full h-full md:max-w-5xl md:h-[90vh] bg-white dark:bg-[#0a0a0a] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
        
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-neutral-900 flex items-center justify-between bg-white dark:bg-[#0a0a0a] z-10">
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs md:text-sm">Desenho Livre</h3>
            <span className="text-[10px] text-slate-400 dark:text-neutral-600 font-medium md:hidden">Use o dedo para desenhar</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div ref={containerRef} className="flex-1 bg-slate-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white shadow-inner cursor-crosshair touch-none"
          />
        </div>

        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-neutral-900 flex flex-col gap-4 bg-white dark:bg-[#0a0a0a] z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => setTool('pencil')}
                className={`p-2.5 md:p-3 rounded-xl transition-all ${tool === 'pencil' ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300 shadow-sm' : 'bg-slate-50 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600'}`}
              >
                <Pencil size={20} />
              </button>
              <button 
                onClick={() => setTool('eraser')}
                className={`p-2.5 md:p-3 rounded-xl transition-all ${tool === 'eraser' ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300 shadow-sm' : 'bg-slate-50 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600'}`}
              >
                <Eraser size={20} />
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-neutral-800 mx-1 md:mx-2 hidden xs:block" />
              
              <div className="flex gap-1.5 md:gap-2">
                {['#000000', 'var(--brand-500)', '#ef4444', '#10b981', '#f59e0b'].map(c => (
                  <button 
                    key={c}
                    onClick={() => { setColor(c); setTool('pencil'); }}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-transform active:scale-90 ${color === c && tool === 'pencil' ? 'border-brand-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c === 'var(--brand-500)' ? 'var(--brand-500)' : c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest hidden sm:block">Traço</span>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24 md:w-32 h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button 
              onClick={clearCanvas}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:px-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-[0.15em]"
            >
              <RotateCcw size={16} /> <span className="hidden xs:inline">Limpar</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-10 rounded-2xl bg-brand-500 dark:bg-brand-400 text-white dark:text-neutral-950 hover:bg-brand-600 transition-all text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-brand-500/20 dark:shadow-none"
            >
              <Check size={18} /> Confirmar Desenho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingModal;
