# WindowManager API Reference

Complete API reference for the WindowManager native module.

## Table of Contents

- [Interfaces](#interfaces)
- [Methods](#methods)
- [Error Codes](#error-codes)
- [Events](#events)
- [Constants](#constants)

---

## Interfaces

### WindowOptions

Configuration options for creating a new window.

```typescript
interface WindowOptions {
  /** Window width in pixels (default: 800) */
  width?: number;
  
  /** Window height in pixels (default: 600) */
  height?: number;
  
  /** Window x position in pixels (default: 100) */
  x?: number;
  
  /** Window y position in pixels (default: 100) */
  y?: number;
  
  /** Window title (default: "New Window") */
  title?: string;
  
  /** Whether the window can be resized (default: true) */
  resizable?: boolean;
  
  /** Whether the window can be minimized (default: true) */
  minimizable?: boolean;
  
  /** Whether the window can be maximized (default: true) */
  maximizable?: boolean;
  
  /** Whether the window can be closed (default: true) */
  closable?: boolean;
  
  /** Whether the window stays on top of other windows (default: false) */
  alwaysOnTop?: boolean;
  
  /** Whether the window starts in fullscreen mode (default: false) */
  fullscreen?: boolean;
  
  /** The name of the React component to render in the window (required) */
  componentName: string;
  
  /** Initial properties to pass to the React component */
  initialProps?: Record<string, any>;
}
```

### WindowInfo

Information about a managed window.

```typescript
interface WindowInfo {
  /** Unique identifier for the window */
  id: string;
  
  /** Current title of the window */
  title: string;
  
  /** Whether the window is currently visible */
  visible: boolean;
  
  /** Whether the window is minimized */
  minimized: boolean;
  
  /** Whether the window is maximized */
  maximized: boolean;
  
  /** Whether the window is in fullscreen mode */
  fullscreen: boolean;
  
  /** Current window position and size */
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```

### WindowError

Error object returned when window operations fail.

```typescript
interface WindowError extends Error {
  /** Error code identifying the type of error */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional context about the error */
  details?: Record<string, any>;
}
```

---

## Methods

### openNewWindow

Creates and opens a new window with React Native content.

```typescript
function openNewWindow(options: WindowOptions): Promise<string>
```

**Parameters:**
- `options` - Configuration for the new window

**Returns:**
- `Promise<string>` - Resolves to a unique window ID

**Throws:**
- `COMPONENT_NOT_REGISTERED` - The specified component is not registered with AppRegistry
- `WINDOW_CREATION_FAILED` - Failed to create the native window
- `INVALID_PARAMETERS` - Invalid parameters provided

**Example:**
```typescript
try {
  const windowId = await WindowManager.openNewWindow({
    componentName: 'MyComponent',
    title: 'My Window',
    width: 600,
    height: 400,
    initialProps: { data: 'example' }
  });
  console.log(`Window created: ${windowId}`);
} catch (error) {
  console.error('Failed to create window:', error);
}
```

---

### closeWindow

Closes a specific window.

```typescript
function closeWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to close

**Returns:**
- `Promise<void>` - Resolves when the window is closed

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
try {
  await WindowManager.closeWindow('window-123');
  console.log('Window closed successfully');
} catch (error) {
  console.error('Failed to close window:', error);
}
```

---

### focusWindow

Brings a window to the front and gives it focus.

```typescript
function focusWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to focus

**Returns:**
- `Promise<void>` - Resolves when the window is focused

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.focusWindow('window-123');
```

---

### setWindowTitle

Updates the title of a window.

```typescript
function setWindowTitle(windowId: string, title: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to update
- `title` - The new title for the window

**Returns:**
- `Promise<void>` - Resolves when the title is updated

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.setWindowTitle('window-123', 'Updated Title');
```

---

### resizeWindow

Changes the size of a window.

```typescript
function resizeWindow(windowId: string, width: number, height: number): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to resize
- `width` - New width in pixels
- `height` - New height in pixels

**Returns:**
- `Promise<void>` - Resolves when the window is resized

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist
- `INVALID_PARAMETERS` - Invalid width or height values

**Example:**
```typescript
await WindowManager.resizeWindow('window-123', 800, 600);
```

---

### moveWindow

Changes the position of a window.

```typescript
function moveWindow(windowId: string, x: number, y: number): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to move
- `x` - New x position in pixels
- `y` - New y position in pixels

**Returns:**
- `Promise<void>` - Resolves when the window is moved

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.moveWindow('window-123', 200, 150);
```

---

### minimizeWindow

Minimizes a window.

```typescript
function minimizeWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to minimize

**Returns:**
- `Promise<void>` - Resolves when the window is minimized

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.minimizeWindow('window-123');
```

---

### maximizeWindow

Maximizes a window or restores it from maximized state.

```typescript
function maximizeWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to maximize/restore

**Returns:**
- `Promise<void>` - Resolves when the window state is changed

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.maximizeWindow('window-123');
```

---

### getWindowList

Retrieves a list of all managed windows.

```typescript
function getWindowList(): Promise<WindowInfo[]>
```

**Parameters:**
None

**Returns:**
- `Promise<WindowInfo[]>` - Array of window information objects

**Example:**
```typescript
const windows = await WindowManager.getWindowList();
console.log(`${windows.length} windows are open`);
windows.forEach(window => {
  console.log(`${window.title}: ${window.visible ? 'visible' : 'hidden'}`);
});
```

---

### getWindowInfo

Retrieves detailed information about a specific window.

```typescript
function getWindowInfo(windowId: string): Promise<WindowInfo>
```

**Parameters:**
- `windowId` - The ID of the window to get information about

**Returns:**
- `Promise<WindowInfo>` - Detailed window information

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
const info = await WindowManager.getWindowInfo('window-123');
console.log(`Window "${info.title}" is at position (${info.frame.x}, ${info.frame.y})`);
```

---

### setWindowAlwaysOnTop

Sets whether a window should stay on top of other windows.

```typescript
function setWindowAlwaysOnTop(windowId: string, alwaysOnTop: boolean): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to modify
- `alwaysOnTop` - Whether the window should stay on top

**Returns:**
- `Promise<void>` - Resolves when the setting is applied

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
// Make window stay on top
await WindowManager.setWindowAlwaysOnTop('window-123', true);

// Remove always on top
await WindowManager.setWindowAlwaysOnTop('window-123', false);
```

---

### setWindowFullscreen

Sets whether a window should be in fullscreen mode.

```typescript
function setWindowFullscreen(windowId: string, fullscreen: boolean): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to modify
- `fullscreen` - Whether the window should be fullscreen

**Returns:**
- `Promise<void>` - Resolves when the setting is applied

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
// Enter fullscreen
await WindowManager.setWindowFullscreen('window-123', true);

// Exit fullscreen
await WindowManager.setWindowFullscreen('window-123', false);
```

---

### hideWindow

Hides a window without closing it.

```typescript
function hideWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to hide

**Returns:**
- `Promise<void>` - Resolves when the window is hidden

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.hideWindow('window-123');
```

---

### showWindow

Shows a previously hidden window.

```typescript
function showWindow(windowId: string): Promise<void>
```

**Parameters:**
- `windowId` - The ID of the window to show

**Returns:**
- `Promise<void>` - Resolves when the window is shown

**Throws:**
- `WINDOW_NOT_FOUND` - The specified window ID does not exist

**Example:**
```typescript
await WindowManager.showWindow('window-123');
```

---

## Error Codes

### COMPONENT_NOT_REGISTERED

The specified React component is not registered with AppRegistry.

**Cause:** Component name provided to `openNewWindow` doesn't match any registered components.

**Solution:** Register the component using `AppRegistry.registerComponent()` before opening the window.

---

### WINDOW_NOT_FOUND

The specified window ID does not exist or has been closed.

**Cause:** Attempting to perform operations on a window that doesn't exist.

**Solution:** Check if the window exists using `getWindowList()` before performing operations.

---

### WINDOW_CREATION_FAILED

Failed to create the native window.

**Possible Causes:**
- Invalid window parameters (negative dimensions, etc.)
- System resource limitations
- Platform-specific restrictions

**Solution:** Validate parameters and check system resources.

---

### INVALID_PARAMETERS

Invalid parameters provided to a method.

**Possible Causes:**
- Negative or zero dimensions for window size
- Invalid window positions
- Null or undefined required parameters

**Solution:** Validate all parameters before making method calls.

---

### BRIDGE_NOT_AVAILABLE

The React Native bridge is not available.

**Cause:** Attempting to use WindowManager before the bridge is initialized.

**Solution:** Ensure the app has fully loaded before using WindowManager.

---

### OPERATION_FAILED

A window operation failed for an unspecified reason.

**Cause:** Platform-specific error during window operation.

**Solution:** Check platform logs for more details and retry the operation.

---

## Events

The WindowManager module can emit events through the React Native event system.

### windowDidOpen

Emitted when a window is successfully opened.

```typescript
import { DeviceEventEmitter } from 'react-native';

DeviceEventEmitter.addListener('windowDidOpen', (event) => {
  console.log(`Window opened: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
  title: string;
  componentName: string;
}
```

---

### windowDidClose

Emitted when a window is closed.

```typescript
DeviceEventEmitter.addListener('windowDidClose', (event) => {
  console.log(`Window closed: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
  reason: 'user' | 'programmatic' | 'system';
}
```

---

### windowDidResize

Emitted when a window is resized.

```typescript
DeviceEventEmitter.addListener('windowDidResize', (event) => {
  console.log(`Window resized: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
  oldSize: { width: number; height: number };
  newSize: { width: number; height: number };
}
```

---

### windowDidMove

Emitted when a window is moved.

```typescript
DeviceEventEmitter.addListener('windowDidMove', (event) => {
  console.log(`Window moved: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
  oldPosition: { x: number; y: number };
  newPosition: { x: number; y: number };
}
```

---

### windowDidFocus

Emitted when a window gains focus.

```typescript
DeviceEventEmitter.addListener('windowDidFocus', (event) => {
  console.log(`Window focused: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
}
```

---

### windowDidBlur

Emitted when a window loses focus.

```typescript
DeviceEventEmitter.addListener('windowDidBlur', (event) => {
  console.log(`Window lost focus: ${event.windowId}`);
});
```

**Event Data:**
```typescript
{
  windowId: string;
}
```

---

## Constants

### Default Values

```typescript
const DEFAULT_WINDOW_OPTIONS = {
  width: 800,
  height: 600,
  x: 100,
  y: 100,
  title: 'New Window',
  resizable: true,
  minimizable: true,
  maximizable: true,
  closable: true,
  alwaysOnTop: false,
  fullscreen: false,
};
```

### Window Style Masks (macOS)

```typescript
const WINDOW_STYLE_MASKS = {
  BORDERLESS: 0,
  TITLED: 1,
  CLOSABLE: 2,
  MINIATURIZABLE: 4,
  RESIZABLE: 8,
  UTILITY: 16,
  DOC_MODAL: 64,
  NONACTIVATING_PANEL: 128,
  HUD_WINDOW: 8192,
};
```

### Window Levels (macOS)

```typescript
const WINDOW_LEVELS = {
  NORMAL: 0,
  FLOATING: 3,
  MODAL_PANEL: 8,
  MAIN_MENU: 24,
  STATUS: 25,
  POPUP_MENU: 101,
  SCREEN_SAVER: 1000,
};
```

---

## Usage Examples

### Basic Window Creation

```typescript
import WindowManager from './WindowManager';
import { AppRegistry } from 'react-native';

// Register component
AppRegistry.registerComponent('MyWindow', () => MyComponent);

// Create window
const windowId = await WindowManager.openNewWindow({
  componentName: 'MyWindow',
  title: 'My Application Window',
  width: 800,
  height: 600,
});
```

### Advanced Window Management

```typescript
class WindowController {
  private windows: Map<string, WindowInfo> = new Map();

  async createWindow(componentName: string, options: Partial<WindowOptions> = {}) {
    try {
      const windowId = await WindowManager.openNewWindow({
        componentName,
        ...options,
      });

      const info = await WindowManager.getWindowInfo(windowId);
      this.windows.set(windowId, info);

      return windowId;
    } catch (error) {
      console.error('Failed to create window:', error);
      throw error;
    }
  }

  async closeAllWindows() {
    const promises = Array.from(this.windows.keys()).map(async (windowId) => {
      try {
        await WindowManager.closeWindow(windowId);
        this.windows.delete(windowId);
      } catch (error) {
        console.error(`Failed to close window ${windowId}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  getWindowCount(): number {
    return this.windows.size;
  }
}
```

This API reference provides complete documentation for all available methods, interfaces, and functionality of the WindowManager module.
