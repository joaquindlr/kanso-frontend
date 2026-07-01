import { Excalidraw } from "@excalidraw/excalidraw";
import React from "react";
type ExcalidrawProps = React.ComponentProps<typeof Excalidraw>;
export type ExcalidrawInitialDataState = ExcalidrawProps["initialData"];
export type OnChangeCallback = NonNullable<ExcalidrawProps["onChange"]>;
export type ExcalidrawElement = Parameters<OnChangeCallback>[0][number];
export type AppState = Parameters<OnChangeCallback>[1];
export type BinaryFiles = Parameters<OnChangeCallback>[2];
