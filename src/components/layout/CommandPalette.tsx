import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Plus, FilePlus, MonitorOff } from 'lucide-react';
import { useZenModeStore } from '@/store/zenModeStore';
import { getNavbarRoutes } from '@/config/routes';

const ShortcutKey = ({ keys }: { keys: string[] }) => (
  <div className="flex gap-1">
    {keys.map((k, i) => (
      <kbd key={i} className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium font-sans">
        {k}
      </kbd>
    ))}
  </div>
);

interface PaletteItemProps {
  icon: React.ReactNode;
  label: string;
  shortcuts?: string[];
  onSelect: () => void;
}

const PaletteItem = ({ icon, label, shortcuts, onSelect }: PaletteItemProps) => (
  <Command.Item
    onSelect={onSelect}
    className="flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    {shortcuts && <ShortcutKey keys={shortcuts} />}
  </Command.Item>
);

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
              {getNavbarRoutes().map((route, index) => {
                const Icon = route.navbarConfig!.icon;
                return (
                  <PaletteItem
                    key={route.path}
                    icon={<span className="flex items-center justify-center [&>svg]:size-4"><Icon /></span>}
                    label={`Ir a ${route.navbarConfig!.name}`}
                    shortcuts={['Alt', String(index + 1)]}
                    onSelect={() => runCommand(() => navigate(route.path))}
                  />
                );
              })}
            </Command.Group>

            <div className="h-px bg-border my-2" />

            <Command.Group heading={<div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Acciones Rápidas</div>}>
              <PaletteItem
                icon={<Plus className="w-4 h-4" />}
                label="Crear Nueva Tarea (Issue)"
                shortcuts={['Alt', 'C']}
                onSelect={() => runCommand(() => {
                  navigate('/');
                  setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateIssue')), 100);
                })}
              />
              <PaletteItem
                icon={<FilePlus className="w-4 h-4" />}
                label="Crear Nueva Épica"
                shortcuts={['Alt', 'Shift', 'C']}
                onSelect={() => runCommand(() => {
                  navigate('/epics');
                  setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateEpic')), 100);
                })}
              />
              <PaletteItem
                icon={<MonitorOff className="w-4 h-4" />}
                label={isZenMode ? 'Desactivar Modo Zen' : 'Activar Modo Zen'}
                shortcuts={['Ctrl', '.']}
                onSelect={() => runCommand(() => toggleZenMode())}
              />
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
