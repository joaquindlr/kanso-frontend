import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Kanban, PenTool, LayoutList, Plus, FilePlus, MonitorOff } from 'lucide-react';
import { useZenModeStore } from '@/store/zenModeStore';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isZenMode, toggleZenMode } = useZenModeStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-xl px-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <Command 
          className="w-full bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          <Command.Input 
            autoFocus 
            placeholder="Escribe un comando o busca..." 
            className="w-full bg-transparent text-foreground border-none outline-none focus:ring-0 px-4 py-4 text-lg placeholder:text-muted-foreground"
          />
          
          <Command.List className="max-h-[400px] overflow-y-auto p-2 text-foreground">
            <Command.Empty className="p-4 text-center text-muted-foreground text-sm">
              No se encontraron resultados.
            </Command.Empty>

            <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Navegación</div>}>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/'))}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <Kanban className="w-4 h-4" />
                  <span>Ir al Tablero Kanban</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Alt</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">1</kbd>
                </div>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/whiteboard'))}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span>Ir a la Pizarra (Excalidraw)</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Alt</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">3</kbd>
                </div>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/epics'))}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <LayoutList className="w-4 h-4" />
                  <span>Ver Épicas</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Alt</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">2</kbd>
                </div>
              </Command.Item>
            </Command.Group>

            <div className="h-px bg-border my-2" />

            <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Acciones Rápidas</div>}>
              <Command.Item 
                onSelect={() => runCommand(() => {
                  navigate('/');
                  setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateIssue')), 100);
                })}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Crear Nueva Tarea (Issue)</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Alt</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">C</kbd>
                </div>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => {
                  navigate('/epics');
                  setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateEpic')), 100);
                })}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4" />
                  <span>Crear Nueva Épica</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Alt</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Shift</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">C</kbd>
                </div>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => toggleZenMode())}
                className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <MonitorOff className="w-4 h-4" />
                  <span>{isZenMode ? 'Desactivar Modo Zen' : 'Activar Modo Zen'}</span>
                </div>
                <div className="flex gap-1">
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">Ctrl</kbd>
                  <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">.</kbd>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
