# WindowManager Module Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Implementation](#module-implementation)
3. [Window Lifecycle](#window-lifecycle)
4. [Application Lifecycle](#application-lifecycle)
5. [Window Communication](#window-communication)
6. [JavaScript Context Sharing](#javascript-context-sharing)
7. [Native Modules](#native-modules)
8. [Concurrency Considerations](#concurrency-considerations)
9. [Key Concepts](#key-concepts)
10. [API Reference](#api-reference)

---

## Architecture Overview

### High-Level Architecture

```
┌─ React Native App (Main Process) ─┐
│                                   │
│ ┌─ Main Window ─┐  ┌─ Child Windows ─┐
│ │               │  │                 │
│ │ React Native  │  │ React Native    │
│ │ Components    │  │ Components      │
│ │               │  │                 │
│ │ WindowManager │  │ (Same JS Context)│
│ │ Native Module │  │                 │
│ └───────────────┘  └─────────────────┘
│                                   │
│ ┌─ Swift/Objective-C Layer ─┐     │
│ │                           │     │
│ │ NSWindow Management       │     │
│ │ RCTRootView Creation      │     │
│ │ Bridge Communication     │     │
│ └───────────────────────────┘     │
└───────────────────────────────────┘
```

### Component Architecture

The WindowManager module consists of three main layers:

1. **TypeScript/JavaScript Layer** (`src/index.tsx`)
   - Public API interface
   - Type definitions
   - Promise-based function wrappers

2. **Objective-C Bridge Layer** (`ios/WindowManager.mm`)
   - React Native bridge declarations
   - Method exports to JavaScript
   - Threading configuration

3. **Swift Implementation Layer** (`ios/WindowManager.swift`)
   - Core window management logic
   - NSWindow lifecycle management
   - RCTRootView creation and management

---

## Module Implementation

### How the Module Works

#### 1. Bridge Registration
```objectivec
@interface RCT_EXTERN_MODULE(WindowManager, NSObject)
```
- Registers the WindowManager class as a React Native native module
- Makes Swift methods callable from JavaScript

#### 2. Method Exposure
```objectivec
RCT_EXTERN_METHOD(openNewWindow:(NSDictionary *)options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
```
- Exposes Swift methods to JavaScript with promise-based async APIs
- Handles parameter marshaling between JS and native code

#### 3. Window Creation Process
```swift
private func createNewWindow(options: [String: Any], windowId: String) throws -> NSWindow {
    // 1. Parse options from JavaScript
    // 2. Create NSWindow with specified configuration
    // 3. Create RCTRootView for React Native content
    // 4. Set up window delegate for lifecycle management
    // 5. Display window
}
```

#### 4. React Native Content Rendering
```swift
let rootView = RCTRootView(
    bridge: bridge,
    moduleName: componentName,
    initialProperties: initialProps
)
```
- Uses the same React Native bridge as the main app
- Creates isolated component trees per window
- Shares the same JavaScript context and thread

---

## Window Lifecycle

### Creation Lifecycle

1. **JavaScript Call**
   ```typescript
   const windowId = await openNewWindow({
     componentName: 'MyComponent',
     initialProps: { data: 'example' }
   });
   ```

2. **Bridge Communication**
   - Parameters serialized and sent to native layer
   - Swift method invoked on main thread

3. **Native Window Creation**
   - NSWindow instance created with specified configuration
   - RCTRootView created and attached to window
   - Component registered with AppRegistry is instantiated

4. **Component Mounting**
   - React component lifecycle begins (constructor → componentDidMount)
   - Component renders within the new window context

5. **Window Display**
   - Window becomes visible and interactive
   - WindowDelegate attached for lifecycle events

### Runtime Lifecycle

- **Window Events**: Resize, move, focus, minimize handled by NSWindow
- **Component Updates**: Standard React lifecycle methods apply
- **State Management**: Components maintain independent state trees
- **Props Updates**: Can be updated via window communication patterns

### Destruction Lifecycle

1. **Window Close Trigger**
   - User clicks close button, or
   - `closeWindow(windowId)` called programmatically

2. **Native Cleanup**
   ```swift
   func windowWillClose(_ notification: Notification) {
       windowManager?.managedWindows.removeValue(forKey: windowId)
       windowManager?.windowDelegates.removeValue(forKey: windowId)
   }
   ```

3. **React Component Unmounting**
   - componentWillUnmount called
   - Component tree destroyed
   - Memory cleanup performed

4. **Resource Deallocation**
   - NSWindow deallocated
   - RCTRootView released
   - Delegate references cleared

---

## Application Lifecycle

### Main Window vs Child Windows

#### Main Window Closure Impact
When the main application window is closed:

```swift
// Main window closure typically triggers app termination
NSApp.terminate(nil)
```

**Consequences:**
- ✅ **All child windows are automatically closed**
- ✅ **JavaScript context is destroyed**
- ✅ **All React components unmount**
- ✅ **Application process terminates**

**Best Practices:**
- Implement window close confirmation if child windows contain unsaved data
- Consider making child windows independent of main window lifecycle
- Save critical state before main window closure

#### Child Window Closure Impact
When a child window is closed:

```swift
// Only affects the specific window
window.close()
managedWindows.removeValue(forKey: windowId)
```

**Consequences:**
- ✅ **Main app continues running normally**
- ✅ **Other child windows unaffected**
- ✅ **JavaScript context remains active**
- ✅ **Only that window's React components unmount**

### Application State Transitions

#### App Backgrounding/Foregrounding
- **Background**: All windows minimize but remain in memory
- **Foreground**: Windows restore to previous state
- **Termination**: All windows close, full cleanup occurs

#### Memory Warnings
- React Native's memory management applies to all windows
- Each RCTRootView maintains separate component hierarchies
- JavaScript heap is shared across all windows

---

## Window Communication

### Inter-Window Communication Patterns

#### 1. Shared JavaScript Context
```typescript
// Global state accessible from all windows
global.sharedData = { message: 'Hello from main window' };

// In child window
console.log(global.sharedData.message); // 'Hello from main window'
```

#### 2. Event-Based Communication
```typescript
// Using React Native's built-in event system
import { DeviceEventEmitter } from 'react-native';

// Send message from any window
DeviceEventEmitter.emit('windowMessage', { 
  from: 'window1', 
  data: 'Hello World' 
});

// Listen in any window
DeviceEventEmitter.addListener('windowMessage', (data) => {
  console.log('Received:', data);
});
```

#### 3. State Management Libraries
```typescript
// Redux, Zustand, or other state managers work across windows
import { store } from './store';

// Any window can dispatch actions
store.dispatch({ type: 'UPDATE_DATA', payload: newData });

// All windows with connected components will update
```

#### 4. Native Module Communication
```typescript
// Custom native module for window-to-window messaging
import { WindowMessenger } from './WindowMessenger';

await WindowMessenger.sendMessage('targetWindowId', { data: 'message' });
```

### Communication Limitations

❌ **Direct DOM/View Manipulation**: Cannot directly manipulate other windows' UI
❌ **Synchronous Communication**: All inter-window communication is asynchronous
❌ **Window-Specific Storage**: LocalStorage/AsyncStorage is shared, not per-window

---

## JavaScript Context Sharing

### Shared Resources

✅ **JavaScript Heap**: All windows share the same JavaScript memory space
✅ **Global Variables**: `global` object accessible from all windows
✅ **Module Cache**: Required modules cached and shared
✅ **React Native Bridge**: Single bridge instance serves all windows
✅ **Native Modules**: Same native module instances used by all windows

### Code Example
```typescript
// In main window
global.mainWindowData = { count: 0 };
global.incrementCount = () => global.mainWindowData.count++;

// In child window - same JavaScript context
console.log(global.mainWindowData.count); // 0
global.incrementCount();
console.log(global.mainWindowData.count); // 1
```

### Implications

#### Benefits
- **State Sharing**: Easy to share data between windows
- **Module Reuse**: No duplicate loading of JavaScript modules
- **Performance**: Lower memory footprint than separate processes

#### Considerations
- **Memory Leaks**: Memory leaks affect all windows
- **Global Pollution**: Be careful with global variable usage
- **Error Propagation**: Uncaught errors can affect all windows

---

## Native Modules

### Native Module Usage in Child Windows

✅ **Full Support**: All native modules work in child windows
✅ **Same Instances**: Native modules are singletons shared across windows
✅ **Thread Safety**: Native modules handle multi-window calls on same threads

### Example Usage
```typescript
// In any window (main or child)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

// These work identically in all windows
await AsyncStorage.setItem('key', 'value');
const permission = await PermissionsAndroid.request('CAMERA');
```

### Native Module Implementation Considerations

#### Thread Safety
```swift
// Native modules should handle concurrent calls
@objc func someMethod() {
    DispatchQueue.main.async {
        // Ensure UI operations on main thread
    }
}
```

#### State Management
```swift
// Use thread-safe patterns for shared state
private let lock = NSLock()
private var sharedState: [String: Any] = [:]

@objc func updateState(key: String, value: Any) {
    lock.lock()
    defer { lock.unlock() }
    sharedState[key] = value
}
```

---

## Concurrency Considerations

### Potential Concurrency Issues

#### 1. Race Conditions
```typescript
// Problem: Multiple windows modifying shared state
// Window 1
global.counter = (global.counter || 0) + 1;

// Window 2 (simultaneously)
global.counter = (global.counter || 0) + 1;

// Result: Race condition, counter might only increment by 1
```

**Solution:**
```typescript
// Use atomic operations or locks
global.incrementCounter = (() => {
  let counter = 0;
  return () => ++counter;
})();
```

#### 2. Native Module Concurrency
```swift
// Problem: Multiple windows calling native methods simultaneously
@objc func updateFile(content: String) {
    // Not thread-safe - could corrupt file
    content.write(to: fileURL, atomically: false, encoding: .utf8)
}
```

**Solution:**
```swift
// Use serial queues for thread safety
private let serialQueue = DispatchQueue(label: "file.operations")

@objc func updateFile(content: String) {
    serialQueue.async {
        try? content.write(to: fileURL, atomically: true, encoding: .utf8)
    }
}
```

#### 3. UI Thread Blocking
```swift
// Problem: Long-running operations blocking UI
@objc func heavyComputation() -> String {
    // This blocks all windows' UI
    return performExpensiveWork()
}
```

**Solution:**
```swift
@objc func heavyComputation(callback: @escaping RCTResponseSenderBlock) {
    DispatchQueue.global(qos: .background).async {
        let result = performExpensiveWork()
        DispatchQueue.main.async {
            callback([result])
        }
    }
}
```

### Best Practices for Concurrency

1. **Use Immutable Data Structures** where possible
2. **Implement Proper Locking** for shared mutable state
3. **Avoid Blocking the Main Thread** in native modules
4. **Use React's Concurrent Features** (useCallback, useMemo) appropriately
5. **Test Multi-Window Scenarios** thoroughly

---

## Key Concepts

### React Native Concepts Used

#### 1. **AppRegistry**
- **Purpose**: Registers components that can be rendered as root views
- **Usage**: `AppRegistry.registerComponent('ComponentName', () => Component)`
- **Importance**: Essential for multi-window rendering

#### 2. **RCTBridge**
- **Purpose**: Communication bridge between JavaScript and native code
- **Usage**: Shared across all windows for consistent state
- **Importance**: Enables native module calls from any window

#### 3. **RCTRootView**
- **Purpose**: Native view that hosts React Native component trees
- **Usage**: One per window, manages component lifecycle
- **Importance**: Renders React components in native windows

#### 4. **Native Modules**
- **Purpose**: Expose native platform APIs to JavaScript
- **Usage**: Accessible from any window through the bridge
- **Importance**: Provides platform-specific functionality

#### 5. **Component Lifecycle**
- **Purpose**: Manages component mounting, updating, and unmounting
- **Usage**: Standard React lifecycle methods apply per window
- **Importance**: Proper cleanup prevents memory leaks

### Native Platform Concepts

#### macOS/Cocoa Concepts

##### 1. **NSWindow**
- **Purpose**: Represents a window in the macOS windowing system
- **Properties**: Frame, title, style, level, delegate
- **Lifecycle**: Create → Configure → Display → Manage → Destroy

##### 2. **NSWindowDelegate**
- **Purpose**: Handles window lifecycle events
- **Methods**: `windowWillClose`, `windowDidResize`, etc.
- **Usage**: Cleanup resources when windows close

##### 3. **NSView Hierarchy**
- **Purpose**: Container for UI elements within windows
- **Structure**: NSWindow → NSView → RCTRootView → React Components
- **Importance**: Proper view hierarchy for rendering

##### 4. **Main Thread/Run Loop**
- **Purpose**: Handles UI updates and user interactions
- **Requirement**: All UI operations must occur on main thread
- **Pattern**: `DispatchQueue.main.async { ... }`

#### React Native Bridge Concepts

##### 1. **Method Marshaling**
- **Purpose**: Convert JavaScript calls to native method invocations
- **Types**: Primitives, collections, callbacks, promises
- **Serialization**: Automatic conversion between JS and native types

##### 2. **Thread Management**
- **JavaScript Thread**: Executes JavaScript code
- **Main Thread**: Handles UI operations
- **Background Threads**: For non-UI native operations

##### 3. **Memory Management**
- **ARC (Automatic Reference Counting)**: Manages native object lifecycle
- **JavaScript GC**: Manages JavaScript object lifecycle
- **Bridge References**: Prevent premature deallocation

### Interaction Patterns

#### 1. **JavaScript → Native**
```typescript
// JavaScript initiates native method call
const result = await nativeModule.someMethod(parameters);
```
```swift
// Swift method executed, result returned via promise
@objc func someMethod(parameters: [String: Any], 
                     resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
    // Implementation
    resolve(result)
}
```

#### 2. **Native → JavaScript**
```swift
// Native code sends event to JavaScript
bridge.eventDispatcher().sendAppEvent(withName: "EventName", body: data)
```
```typescript
// JavaScript listens for native events
import { NativeEventEmitter } from 'react-native';
const emitter = new NativeEventEmitter(NativeModule);
emitter.addListener('EventName', (data) => { /* handle */ });
```

#### 3. **Window ↔ Window**
```typescript
// Via shared JavaScript context
global.windowMessaging.send('targetWindow', data);

// Via event system
DeviceEventEmitter.emit('crossWindow', { target: 'window2', data });

// Via state management
store.dispatch(updateWindowData('window2', data));
```

---

## API Reference

### TypeScript Interface

```typescript
interface WindowOptions {
  width?: number;           // Window width (default: 800)
  height?: number;          // Window height (default: 600)
  x?: number;              // Window x position (default: 100)
  y?: number;              // Window y position (default: 100)
  title?: string;          // Window title (default: "New Window")
  resizable?: boolean;     // Can resize (default: true)
  minimizable?: boolean;   // Can minimize (default: true)
  maximizable?: boolean;   // Can maximize (default: true)
  closable?: boolean;      // Can close (default: true)
  alwaysOnTop?: boolean;   // Stay on top (default: false)
  fullscreen?: boolean;    // Start fullscreen (default: false)
  componentName: string;   // Required: React component name
  initialProps?: Record<string, any>; // Props for component
}
```

### Methods

```typescript
// Create new window with React Native content
openNewWindow(options: WindowOptions): Promise<string>

// Close specific window
closeWindow(windowId: string): Promise<void>

// Focus/bring window to front
focusWindow(windowId: string): Promise<void>

// Update window title
setWindowTitle(windowId: string, title: string): Promise<void>

// Resize window
resizeWindow(windowId: string, width: number, height: number): Promise<void>

// Move window
moveWindow(windowId: string, x: number, y: number): Promise<void>

// Minimize window
minimizeWindow(windowId: string): Promise<void>

// Maximize window
maximizeWindow(windowId: string): Promise<void>

// Get list of managed windows
getWindowList(): Promise<Array<{id: string, title: string}>>

// Set window always on top
setWindowAlwaysOnTop(windowId: string, alwaysOnTop: boolean): Promise<void>
```

### Error Handling

All methods return promises that can reject with errors:

```typescript
try {
  const windowId = await openNewWindow(options);
} catch (error) {
  // Handle errors:
  // - WINDOW_CREATION_FAILED
  // - WINDOW_NOT_FOUND
  // - INVALID_PARAMETERS
}
```

---

## Summary

The WindowManager module provides a robust multi-window system for React Native macOS applications by:

1. **Leveraging Cocoa's NSWindow system** for native window management
2. **Using RCTRootView** to render React Native components in separate windows
3. **Sharing JavaScript context** across all windows for seamless communication
4. **Maintaining proper lifecycle management** to prevent memory leaks
5. **Supporting full native module functionality** in all windows
6. **Providing thread-safe concurrent access** to shared resources

The module's architecture ensures that each window behaves as a first-class React Native application while maintaining efficient resource usage through shared JavaScript context and native module instances.
