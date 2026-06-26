import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGlobalShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el foco está en un input, textarea o elemento con contenteditable
      // (Aunque Alt suele ser seguro, es buena práctica por si acaso)
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement && activeElement.isContentEditable);

      if (isInputFocused) return;

      // Navegación con Alt + 1, 2, 3
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case '1':
          case '¡': // Para teclados en español a veces Alt+1 manda el caracter
            e.preventDefault();
            navigate('/');
            break;
          case '2':
          case '™':
            e.preventDefault();
            navigate('/epics');
            break;
          case '3':
          case '£':
            e.preventDefault();
            navigate('/whiteboard');
            break;
          case 'c':
          case 'C':
            e.preventDefault();
            navigate('/');
            setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateIssue')), 100);
            break;
        }
      }

      // Acciones con Alt + Shift + C
      if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          navigate('/epics');
          setTimeout(() => window.dispatchEvent(new CustomEvent('openCreateEpic')), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};
