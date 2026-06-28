import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawInitialDataState, ExcalidrawElement, AppState } from "@/types/excalidraw";
import { useRef, useEffect } from "react";
import { useUpdateProjectWhiteboard } from "@/hooks/useProjects";
import "@excalidraw/excalidraw/index.css";

interface ProjectWhiteboardProps {
  projectId: string;
  initialData?: ExcalidrawInitialDataState;
}

export const ProjectWhiteboard = ({
  projectId,
  initialData,
}: ProjectWhiteboardProps) => {
  const { mutate: updateWhiteboard } = useUpdateProjectWhiteboard();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string | null>(
    initialData ? JSON.stringify(initialData) : null,
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const dataToSave = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
        },
      };

      const stringifiedData = JSON.stringify(dataToSave);

      if (lastSavedDataRef.current !== stringifiedData) {
        lastSavedDataRef.current = stringifiedData;
        updateWhiteboard({ projectId, excalidrawData: dataToSave });
      }
    }, 3000);
  };

  return (
    <div className="w-full h-full relative">
      <Excalidraw
        theme="dark"
        initialData={initialData}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            saveAsImage: false,
          },
        }}
      />
    </div>
  );
};
