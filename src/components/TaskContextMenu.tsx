import { useEffect, useRef } from 'react';
import { ArrowLineUp, ArrowLineDown } from '@phosphor-icons/react';

interface TaskContextMenuProps {
  x: number;
  y: number;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
  onClose: () => void;
}

export function TaskContextMenu({ x, y, onMoveToTop, onMoveToBottom, onClose }: TaskContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to keep menu within viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const el = menuRef.current;

    if (rect.right > window.innerWidth) {
      el.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = `${y - rect.height}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
      style={{ left: x, top: y }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveToTop();
        }}
        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
      >
        <ArrowLineUp size={16} weight="bold" />
        Enviar a la parte superior
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveToBottom();
        }}
        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
      >
        <ArrowLineDown size={16} weight="bold" />
        Enviar a la parte inferior
      </button>
    </div>
  );
}
