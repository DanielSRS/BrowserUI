import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package 'react-native-window-manager' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Create a safer proxy that doesn't throw immediately
const createSafeProxy = () => {
  return new Proxy(
    {},
    {
      get(target, prop) {
        console.warn(
          `WindowManager: ${String(prop)} called but module not available`,
        );
        return () => Promise.reject(new Error(LINKING_ERROR));
      },
    },
  );
};

const _WindowManager =
  Platform.OS === 'macos' && NativeModules.WindowManager
    ? NativeModules.WindowManager
    : createSafeProxy();

export interface WindowOptions {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  title?: string;
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  alwaysOnTop?: boolean;
  fullscreen?: boolean;
  componentName: string; // Required: React Native component to render
  initialProps?: Record<string, any>; // Optional: Props to pass to the component
}

export function openNewWindow(options: WindowOptions): Promise<string> {
  return _WindowManager.openNewWindow(options);
}

export function closeWindow(windowId: string): Promise<void> {
  return _WindowManager.closeWindow(windowId);
}

export function focusWindow(windowId: string): Promise<void> {
  return _WindowManager.focusWindow(windowId);
}

export function setWindowTitle(windowId: string, title: string): Promise<void> {
  return _WindowManager.setWindowTitle(windowId, title);
}

export function resizeWindow(
  windowId: string,
  width: number,
  height: number,
): Promise<void> {
  return _WindowManager.resizeWindow(windowId, width, height);
}

export function moveWindow(
  windowId: string,
  x: number,
  y: number,
): Promise<void> {
  return _WindowManager.moveWindow(windowId, x, y);
}

export function minimizeWindow(windowId: string): Promise<void> {
  return _WindowManager.minimizeWindow(windowId);
}

export function maximizeWindow(windowId: string): Promise<void> {
  return _WindowManager.maximizeWindow(windowId);
}

export function getWindowList(): Promise<Array<{ id: string; title: string }>> {
  return _WindowManager.getWindowList();
}

export function setWindowAlwaysOnTop(
  windowId: string,
  alwaysOnTop: boolean,
): Promise<void> {
  return _WindowManager.setWindowAlwaysOnTop(windowId, alwaysOnTop);
}
