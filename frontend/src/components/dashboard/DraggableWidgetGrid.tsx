import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DotsSixVertical, ArrowCounterClockwise } from '@phosphor-icons/react';

export type WidgetSize = 'small' | 'wide' | 'tall' | 'large';

export interface WidgetItem {
  id: string;
  title: string;
  size: WidgetSize;
  content: React.ReactNode;
}

interface DraggableWidgetGridProps {
  widgets: WidgetItem[];
  onOrderChange?: (newOrder: string[]) => void;
}

export const DraggableWidgetGrid: React.FC<DraggableWidgetGridProps> = ({
  widgets: initialWidgets,
  onOrderChange
}) => {
  const [items, setItems] = useState<WidgetItem[]>(initialWidgets);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Sync if initialWidgets updates (e.g. data loaded)
  React.useEffect(() => {
    setItems((prev) => {
      // preserve user order if possible
      const itemMap = new Map(initialWidgets.map(w => [w.id, w]));
      return prev.map(p => itemMap.get(p.id) || p);
    });
  }, [initialWidgets]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setItems((prev) => {
      const draggedIndex = prev.findIndex(item => item.id === draggedId);
      const targetIndex = prev.findIndex(item => item.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newItems = [...prev];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);

      if (onOrderChange) {
        onOrderChange(newItems.map(i => i.id));
      }
      return newItems;
    });
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // Keyboard accessibility: Alt + Arrow keys
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!e.altKey) return;
    
    let targetIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      targetIndex = Math.min(index + 1, items.length - 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      targetIndex = Math.max(index - 1, 0);
    } else {
      return;
    }

    if (targetIndex !== index) {
      e.preventDefault();
      setItems((prev) => {
        const newItems = [...prev];
        const [removed] = newItems.splice(index, 1);
        newItems.splice(targetIndex, 0, removed);
        if (onOrderChange) onOrderChange(newItems.map(i => i.id));
        return newItems;
      });
    }
  };

  const resetToDefaultLayout = () => {
    setItems(initialWidgets);
    if (onOrderChange) onOrderChange(initialWidgets.map(i => i.id));
  };

  // Map widget size to grid column spans (4-column responsive grid)
  const getSizeClasses = (size: WidgetSize) => {
    switch (size) {
      case 'wide':
        // Takes 2 columns on desktop
        return 'col-span-1 md:col-span-2 min-h-[220px]';
      case 'small':
        // Takes 1 column on desktop
        return 'col-span-1 min-h-[220px]';
      case 'tall':
        return 'col-span-1 md:row-span-2 min-h-[460px]';
      case 'large':
        return 'col-span-1 md:col-span-2 md:row-span-2 min-h-[460px]';
      default:
        return 'col-span-1 min-h-[220px]';
    }
  };

  return (
    <div className="space-y-3">
      {/* Grid Toolbar */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span className="flex items-center gap-1.5">
          <DotsSixVertical size={14} />
          <span>Interactive Draggable Widget Grid (Drag handles to reorder, or use Alt + Arrow keys)</span>
        </span>
        <button
          onClick={resetToDefaultLayout}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-charcoal hover:underline"
        >
          <ArrowCounterClockwise size={12} />
          <span>Reset Layout</span>
        </button>
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
        <AnimatePresence>
          {items.map((widget, index) => {
            const isDragging = draggedId === widget.id;
            const sizeClass = getSizeClasses(widget.size);

            return (
              <motion.div
                key={widget.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`relative group ${sizeClass}`}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                tabIndex={0}
                role="region"
                aria-label={`${widget.title} widget. Alt + Arrow keys to rearrange.`}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {/* Drag Handle Top Bar */}
                <div
                  draggable
                  onDragStart={() => handleDragStart(widget.id)}
                  onDragEnd={handleDragEnd}
                  title="Drag to rearrange widget"
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded bg-surface/80 hover:bg-slate-200 text-slate-400 hover:text-charcoal cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <DotsSixVertical size={14} />
                </div>

                <div className={`h-full transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`}>
                  {widget.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
