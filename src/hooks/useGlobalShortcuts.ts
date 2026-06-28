import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNavbarRoutes } from "@/config/routes";

export const useGlobalShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      if (isInputFocused) return;

      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const navbarRoutes = getNavbarRoutes();
        
        // Handle Alt + Number (1-N)
        let num: number | null = null;
        if (e.code && e.code.startsWith('Digit')) {
          num = parseInt(e.code.replace('Digit', ''), 10);
        } else {
          // Fallback mapping for Mac specific characters if e.code is not reliable
          const charMap: Record<string, number> = {
            '1': 1, '¡': 1,
            '2': 2, '™': 2,
            '3': 3, '£': 3,
            '4': 4, '¢': 4,
            '5': 5, '∞': 5,
            '6': 6, '§': 6,
            '7': 7, '¶': 7,
            '8': 8, '•': 8,
            '9': 9, 'ª': 9,
          };
          if (charMap[e.key]) {
            num = charMap[e.key];
          }
        }

        if (num !== null && !isNaN(num) && num >= 1 && num <= navbarRoutes.length) {
          e.preventDefault();
          navigate(navbarRoutes[num - 1].path);
          return;
        }

        switch (e.key) {
          case "c":
          case "C":
            e.preventDefault();
            navigate("/");
            setTimeout(
              () => window.dispatchEvent(new CustomEvent("openCreateIssue")),
              100,
            );
            break;
        }
      }

      if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          navigate("/epics");
          setTimeout(
            () => window.dispatchEvent(new CustomEvent("openCreateEpic")),
            100,
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
};
