# WindowManager Troubleshooting Guide

This guide helps you diagnose and resolve common issues when using the WindowManager module.

## Common Issues

### 1. Component Not Registered Error

**Error Message:**
```
Component 'MyComponent' not registered with AppRegistry
```

**Cause:**
The React component you're trying to display in a window hasn't been registered with AppRegistry.

**Solution:**
```typescript
import { AppRegistry } from 'react-native';

// Register your component BEFORE trying to open a window
const MyComponent = () => (
  <View>
    <Text>Hello from window!</Text>
  </View>
);

AppRegistry.registerComponent('MyComponent', () => MyComponent);

// Now you can open the window
WindowManager.openNewWindow({
  componentName: 'MyComponent', // Must match registered name exactly
  title: 'My Window'
});
```

**Prevention:**
- Always register components immediately after defining them
- Use consistent naming between registration and window creation
- Consider creating a centralized component registry file

---

### 2. Window Creation Failed

**Error Message:**
```
WINDOW_CREATION_FAILED: Unable to create native window
```

**Cause:**
Native window creation failed due to invalid parameters or system limitations.

**Common Causes & Solutions:**

#### Invalid Window Dimensions
```typescript
// ❌ Invalid dimensions
WindowManager.openNewWindow({
  componentName: 'MyComponent',
  width: -100,  // Negative width
  height: 0     // Zero height
});

// ✅ Valid dimensions
WindowManager.openNewWindow({
  componentName: 'MyComponent',
  width: 400,   // Positive width
  height: 300   // Positive height
});
```

#### Invalid Window Position
```typescript
// ❌ Position outside screen bounds
WindowManager.openNewWindow({
  componentName: 'MyComponent',
  x: -10000,
  y: -10000
});

// ✅ Valid position (or omit for default)
WindowManager.openNewWindow({
  componentName: 'MyComponent',
  x: 100,
  y: 100
});
```

#### System Resource Limits
- **Issue**: Too many windows open simultaneously
- **Solution**: Close unused windows or implement window pooling
- **Check**: Monitor memory usage and window count

---

### 3. Window Not Responding

**Symptoms:**
- Window appears but is unresponsive
- JavaScript not executing in window
- Component not rendering

**Diagnostic Steps:**

#### Check Bridge Connection
```typescript
// Add debug logging to your component
const MyComponent = () => {
  useEffect(() => {
    console.log('Component mounted in window');
    
    // Test bridge connectivity
    console.log('Bridge available:', !!global.__reactNativeBridge);
    
    return () => {
      console.log('Component unmounting from window');
    };
  }, []);

  return <View><Text>Debug Component</Text></View>;
};
```

#### Verify Component Registration
```typescript
// Check if component is properly registered
const registeredComponents = Object.keys(AppRegistry.getRunnable());
console.log('Registered components:', registeredComponents);

if (!registeredComponents.includes('MyComponent')) {
  console.error('Component not registered!');
}
```

#### Test with Minimal Component
```typescript
// Create a minimal test component
const TestComponent = () => (
  <View style={{ flex: 1, backgroundColor: 'red' }}>
    <Text>Test Component Working</Text>
  </View>
);

AppRegistry.registerComponent('TestComponent', () => TestComponent);

// If this works, the issue is with your complex component
WindowManager.openNewWindow({
  componentName: 'TestComponent',
  title: 'Test Window'
});
```

---

### 4. Memory Leaks

**Symptoms:**
- App memory usage increases over time
- Performance degradation
- Windows not properly cleaning up

**Common Causes & Solutions:**

#### Event Listeners Not Removed
```typescript
// ❌ Memory leak - listener never removed
const MyComponent = () => {
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('myEvent', handler);
    // Missing cleanup!
  }, []);
};

// ✅ Proper cleanup
const MyComponent = () => {
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('myEvent', handler);
    
    return () => {
      listener.remove(); // Clean up listener
    };
  }, []);
};
```

#### Timers Not Cleared
```typescript
// ❌ Timer continues after component unmounts
const MyComponent = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Timer running');
    }, 1000);
    // Missing cleanup!
  }, []);
};

// ✅ Proper timer cleanup
const MyComponent = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Timer running');
    }, 1000);
    
    return () => {
      clearInterval(interval); // Clean up timer
    };
  }, []);
};
```

#### Global References Not Cleared
```typescript
// ❌ Global reference prevents garbage collection
const MyComponent = () => {
  useEffect(() => {
    global.myComponentRef = someValue;
    // Missing cleanup!
  }, []);
};

// ✅ Clean up global references
const MyComponent = () => {
  useEffect(() => {
    global.myComponentRef = someValue;
    
    return () => {
      delete global.myComponentRef; // Clean up global reference
    };
  }, []);
};
```

---

### 5. Performance Issues

**Symptoms:**
- Slow window creation
- Laggy UI in windows
- High CPU/memory usage

**Optimization Strategies:**

#### Optimize Component Rendering
```typescript
// ❌ Heavy computation in render
const MyComponent = () => {
  const heavyComputation = () => {
    // Expensive operation on every render
    return data.map(item => complexTransform(item));
  };

  return (
    <View>
      {heavyComputation().map(item => (
        <Text key={item.id}>{item.value}</Text>
      ))}
    </View>
  );
};

// ✅ Memoize expensive computations
const MyComponent = () => {
  const processedData = useMemo(() => {
    return data.map(item => complexTransform(item));
  }, [data]);

  return (
    <View>
      {processedData.map(item => (
        <Text key={item.id}>{item.value}</Text>
      ))}
    </View>
  );
};
```

#### Lazy Component Loading
```typescript
// ✅ Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const MyWindow = () => (
  <Suspense fallback={<Text>Loading...</Text>}>
    <HeavyComponent />
  </Suspense>
);
```

#### Limit Concurrent Windows
```typescript
// ✅ Implement window management
class WindowPool {
  private static maxWindows = 5;
  private static openWindows = new Set<string>();

  static async openWindow(options: WindowOptions): Promise<string | null> {
    if (this.openWindows.size >= this.maxWindows) {
      console.warn('Maximum windows reached');
      return null;
    }

    const windowId = await WindowManager.openNewWindow(options);
    this.openWindows.add(windowId);
    
    return windowId;
  }

  static async closeWindow(windowId: string) {
    await WindowManager.closeWindow(windowId);
    this.openWindows.delete(windowId);
  }
}
```

---

### 6. Inter-Window Communication Issues

**Problem:** Messages not received between windows

**Diagnostic Steps:**

#### Test Event System
```typescript
// In sender window
console.log('Sending message...');
DeviceEventEmitter.emit('testMessage', { data: 'hello' });

// In receiver window
useEffect(() => {
  console.log('Setting up listener...');
  const listener = DeviceEventEmitter.addListener('testMessage', (data) => {
    console.log('Received message:', data);
  });

  return () => {
    console.log('Removing listener...');
    listener.remove();
  };
}, []);
```

#### Verify Shared Context
```typescript
// Test if windows share JavaScript context
const TestComponent = () => {
  useEffect(() => {
    // Set global variable
    global.testValue = Math.random();
    console.log('Set global value:', global.testValue);

    // Check if other windows can see it
    setTimeout(() => {
      console.log('Global value after delay:', global.testValue);
    }, 1000);
  }, []);
};
```

#### Debug Bridge Status
```typescript
// Check bridge health
const BridgeDebugComponent = () => {
  useEffect(() => {
    console.log('Bridge exists:', !!global.__reactNativeBridge);
    console.log('DeviceEventEmitter available:', !!DeviceEventEmitter);
    
    // Test native module access
    try {
      WindowManager.getWindowList().then(windows => {
        console.log('Bridge working, windows:', windows.length);
      });
    } catch (error) {
      console.error('Bridge communication failed:', error);
    }
  }, []);
};
```

---

## Build Issues

### 1. Swift Compilation Errors

**Error:**
```
Value of optional type 'RCTRootView?' must be unwrapped
```

**Solution:**
```swift
// ❌ Incorrect optional handling
let rootView: RCTRootView? = RCTRootView(...)
window.contentView = rootView // Error

// ✅ Proper optional handling
if let rootView = RCTRootView(...) {
    window.contentView = rootView
} else {
    throw NSError(domain: "WindowManager", code: 1, userInfo: nil)
}
```

### 2. Objective-C Bridge Issues

**Error:**
```
Method not found in WindowManager
```

**Check Bridge Declaration:**
```objectivec
// Ensure all methods are properly declared
@interface RCT_EXTERN_MODULE(WindowManager, NSObject)

RCT_EXTERN_METHOD(openNewWindow:(NSDictionary *)options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

// ... other method declarations

@end
```

### 3. CocoaPods Integration

**Error:**
```
Module 'WindowManager' not found
```

**Check Podspec:**
```ruby
# WindowManager.podspec
Pod::Spec.new do |s|
  s.name         = "WindowManager"
  s.version      = "1.0.0"
  s.summary      = "Native window management for React Native macOS"
  s.homepage     = "https://github.com/yourrepo/WindowManager"
  s.license      = "MIT"
  s.author       = { "Your Name" => "you@example.com" }
  s.source       = { :git => "https://github.com/yourrepo/WindowManager.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true
  s.platforms    = { :osx => "10.14" }
  
  s.dependency "React-Core"
end
```

---

## Debugging Tools

### 1. Enable Verbose Logging

```typescript
// Add to your app initialization
if (__DEV__) {
  global.WINDOW_MANAGER_DEBUG = true;
}

// In your components
const debugLog = (message: string, data?: any) => {
  if (global.WINDOW_MANAGER_DEBUG) {
    console.log(`[WindowManager] ${message}`, data);
  }
};
```

### 2. Window Inspector Component

```typescript
const WindowInspector = () => {
  const [windows, setWindows] = useState([]);
  const [bridgeInfo, setBridgeInfo] = useState({});

  useEffect(() => {
    const updateInfo = async () => {
      try {
        const windowList = await WindowManager.getWindowList();
        setWindows(windowList);
        
        setBridgeInfo({
          bridgeExists: !!global.__reactNativeBridge,
          registeredComponents: Object.keys(AppRegistry.getRunnable()),
          globalKeys: Object.keys(global).filter(key => key.startsWith('__')),
        });
      } catch (error) {
        console.error('Inspector update failed:', error);
      }
    };

    updateInfo();
    const interval = setInterval(updateInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Window Inspector</Text>
      
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Bridge Status:</Text>
      <Text>Bridge Exists: {bridgeInfo.bridgeExists ? 'Yes' : 'No'}</Text>
      
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
        Registered Components ({bridgeInfo.registeredComponents?.length || 0}):
      </Text>
      {bridgeInfo.registeredComponents?.map(name => (
        <Text key={name}>• {name}</Text>
      ))}
      
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
        Active Windows ({windows.length}):
      </Text>
      {windows.map(window => (
        <Text key={window.id}>• {window.title} ({window.id})</Text>
      ))}
    </ScrollView>
  );
};
```

### 3. Performance Monitor

```typescript
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    windowCount: 0,
    memoryUsage: 0,
    jsHeapSize: 0,
  });

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const windows = await WindowManager.getWindowList();
        
        setMetrics({
          windowCount: windows.length,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          jsHeapSize: (performance as any).memory?.totalJSHeapSize || 0,
        });
      } catch (error) {
        console.error('Metrics update failed:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Performance Metrics</Text>
      <Text>Windows: {metrics.windowCount}</Text>
      <Text>JS Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB</Text>
      <Text>JS Heap: {(metrics.jsHeapSize / 1024 / 1024).toFixed(2)} MB</Text>
    </View>
  );
};
```

---

## Best Practices for Avoiding Issues

### 1. Component Registration
```typescript
// ✅ Register components in a central location
// windowComponents.ts
import { AppRegistry } from 'react-native';
import { SettingsWindow } from './SettingsWindow';
import { DataWindow } from './DataWindow';

export const registerWindowComponents = () => {
  AppRegistry.registerComponent('SettingsWindow', () => SettingsWindow);
  AppRegistry.registerComponent('DataWindow', () => DataWindow);
};

// Call during app initialization
registerWindowComponents();
```

### 2. Error Boundaries
```typescript
class WindowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Window error:', error, errorInfo);
    
    // Report error to monitoring service
    // crashlytics().recordError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          <Text>Something went wrong in this window.</Text>
          <Button 
            title="Reload Window" 
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

// Wrap your window components
const SafeWindowComponent = () => (
  <WindowErrorBoundary>
    <YourActualComponent />
  </WindowErrorBoundary>
);
```

### 3. Resource Management
```typescript
// ✅ Custom hook for window lifecycle management
const useWindowCleanup = (windowId: string) => {
  useEffect(() => {
    return () => {
      console.log(`Cleaning up window: ${windowId}`);
      
      // Clean up any global references
      if (global.windowData?.[windowId]) {
        delete global.windowData[windowId];
      }
      
      // Clean up any pending timeouts/intervals
      // clearTimeout/clearInterval as needed
    };
  }, [windowId]);
};
```

By following this troubleshooting guide, you should be able to diagnose and resolve most issues with the WindowManager module. Remember to always check the console logs first, as they often provide the most direct indication of what's going wrong.
