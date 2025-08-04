# WindowManager Native Module

A React Native native module for opening and managing multiple windows in macOS applications.

## Features

- Open new windows with customizable options
- Close windows programmatically
- Focus existing windows
- Resize and move windows
- Set window titles
- Minimize/maximize windows
- Set always-on-top behavior
- Load web content or display custom content
- Get list of managed windows

## Installation

The module is already linked in the project via the local package reference in `package.json`.

To set up the module:

1. Run `pod install` in the `macos` directory:
   ```bash
   cd macos && pod install
   ```

2. Rebuild the macOS app:
   ```bash
   yarn macos
   ```

## Usage

```typescript
import {
  openNewWindow,
  closeWindow,
  focusWindow,
  setWindowTitle,
  resizeWindow,
  moveWindow,
  minimizeWindow,
  maximizeWindow,
  getWindowList,
  setWindowAlwaysOnTop,
  WindowOptions
} from 'react-native-window-manager';

// Open a new window with a web page
const options: WindowOptions = {
  width: 800,
  height: 600,
  title: 'My Web Window',
  url: 'https://www.example.com',
  resizable: true,
  x: 100,
  y: 100
};

const windowId = await openNewWindow(options);

// Open a blank window
const blankWindow = await openNewWindow({
  width: 500,
  height: 400,
  title: 'Blank Window'
});

// Close a window
await closeWindow(windowId);

// Focus a window
await focusWindow(windowId);

// Resize a window
await resizeWindow(windowId, 1000, 700);

// Move a window
await moveWindow(windowId, 200, 150);

// Set window title
await setWindowTitle(windowId, 'New Title');

// Minimize/maximize
await minimizeWindow(windowId);
await maximizeWindow(windowId);

// Set always on top
await setWindowAlwaysOnTop(windowId, true);

// Get list of open windows
const windows = await getWindowList();
```

## WindowOptions Interface

```typescript
interface WindowOptions {
  width?: number;        // Window width (default: 800)
  height?: number;       // Window height (default: 600)
  x?: number;           // Window x position (default: 100)
  y?: number;           // Window y position (default: 100)
  title?: string;       // Window title (default: "New Window")
  resizable?: boolean;  // Can resize window (default: true)
  minimizable?: boolean; // Can minimize window (default: true)
  maximizable?: boolean; // Can maximize window (default: true)
  closable?: boolean;   // Can close window (default: true)
  alwaysOnTop?: boolean; // Always on top (default: false)
  fullscreen?: boolean; // Start in fullscreen (default: false)
  url?: string;         // URL to load (optional, creates blank window if not provided)
}
```

## Example Component

See `src/components/WindowManagerExample.tsx` for a complete example of how to use the WindowManager module in a React Native component.

## Platform Support

Currently supports:
- macOS ✅
- iOS (not applicable - iOS doesn't support multiple windows in the same way)
- Android (not implemented)
- Windows (not implemented)

## Notes

- All windows are managed by the native module and cleaned up automatically when closed
- Windows can load web content using WebKit or display custom native content
- The module handles window lifecycle management and memory cleanup
- All methods return Promises and should be used with async/await or .then()/.catch()
