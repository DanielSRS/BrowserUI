# Usage Examples

This document provides practical examples of how to use the WindowManager module in various scenarios.

## Basic Usage

### Opening a Simple Window

```typescript
import WindowManager from '../WindowManager';
import { AppRegistry } from 'react-native';

// 1. Register your component
const SimpleWindow = () => (
  <View style={{ flex: 1, padding: 20 }}>
    <Text>Hello from new window!</Text>
  </View>
);

AppRegistry.registerComponent('SimpleWindow', () => SimpleWindow);

// 2. Open the window
const openSimpleWindow = async () => {
  try {
    const windowId = await WindowManager.openNewWindow({
      componentName: 'SimpleWindow',
      title: 'My Simple Window',
      width: 400,
      height: 300
    });
    console.log(`Window opened with ID: ${windowId}`);
  } catch (error) {
    console.error('Failed to open window:', error);
  }
};
```

### Opening a Window with Props

```typescript
import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface DataWindowProps {
  items: Array<{ id: string; name: string }>;
  title: string;
}

const DataWindow: React.FC<DataWindowProps> = ({ items, title }) => (
  <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>{title}</Text>
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <Text key={item.id}>{item.name}</Text>
      )}
    />
  </View>
);

AppRegistry.registerComponent('DataWindow', () => DataWindow);

// Open window with data
const openDataWindow = async () => {
  const windowId = await WindowManager.openNewWindow({
    componentName: 'DataWindow',
    title: 'Data Viewer',
    width: 600,
    height: 400,
    initialProps: {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' }
      ],
      title: 'My Data List'
    }
  });
};
```

## Advanced Usage

### Inter-Window Communication

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { DeviceEventEmitter } from 'react-native';

// Main window component
const MainWindow = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('windowMessage', (data) => {
      setReceivedMessage(data.message);
    });

    return () => listener.remove();
  }, []);

  const sendMessage = () => {
    DeviceEventEmitter.emit('windowMessage', { message });
    setMessage('');
  };

  const openChatWindow = async () => {
    await WindowManager.openNewWindow({
      componentName: 'ChatWindow',
      title: 'Chat Window',
      width: 400,
      height: 300
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Main Window</Text>
      <Button title="Open Chat Window" onPress={openChatWindow} />
      
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type message..."
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />
      <Button title="Send Message" onPress={sendMessage} />
      
      {receivedMessage && (
        <Text style={{ marginTop: 10 }}>
          Received: {receivedMessage}
        </Text>
      )}
    </View>
  );
};

// Chat window component
const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('windowMessage', (data) => {
      setReceivedMessage(data.message);
    });

    return () => listener.remove();
  }, []);

  const sendMessage = () => {
    DeviceEventEmitter.emit('windowMessage', { message });
    setMessage('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Chat Window</Text>
      
      {receivedMessage && (
        <Text style={{ marginTop: 10 }}>
          Received: {receivedMessage}
        </Text>
      )}
      
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type message..."
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />
      <Button title="Reply" onPress={sendMessage} />
    </View>
  );
};

AppRegistry.registerComponent('MainWindow', () => MainWindow);
AppRegistry.registerComponent('ChatWindow', () => ChatWindow);
```

### Global State Management

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

// Simple global state manager
class GlobalState {
  private state: any = {};
  private listeners: Array<(state: any) => void> = [];

  setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return this.state;
  }

  subscribe(listener: (state: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// Make it globally available
global.appState = new GlobalState();

// Counter component that works across windows
const CounterWindow = () => {
  const [count, setCount] = useState(global.appState.getState().count || 0);

  useEffect(() => {
    const unsubscribe = global.appState.subscribe((state) => {
      setCount(state.count || 0);
    });
    return unsubscribe;
  }, []);

  const increment = () => {
    global.appState.setState({ count: count + 1 });
  };

  const decrement = () => {
    global.appState.setState({ count: count - 1 });
  };

  const openNewCounter = async () => {
    await WindowManager.openNewWindow({
      componentName: 'CounterWindow',
      title: `Counter Window ${Date.now()}`,
      width: 300,
      height: 200
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Count: {count}</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
      <Button title="Open New Counter" onPress={openNewCounter} />
    </View>
  );
};

AppRegistry.registerComponent('CounterWindow', () => CounterWindow);
```

### Window Management Dashboard

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const WindowDashboard = () => {
  const [windows, setWindows] = useState<Array<{id: string, title: string}>>([]);

  const refreshWindowList = async () => {
    try {
      const windowList = await WindowManager.getWindowList();
      setWindows(windowList);
    } catch (error) {
      console.error('Failed to get window list:', error);
    }
  };

  useEffect(() => {
    refreshWindowList();
    const interval = setInterval(refreshWindowList, 2000);
    return () => clearInterval(interval);
  }, []);

  const closeWindow = async (windowId: string) => {
    try {
      await WindowManager.closeWindow(windowId);
      refreshWindowList();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  const focusWindow = async (windowId: string) => {
    try {
      await WindowManager.focusWindow(windowId);
    } catch (error) {
      console.error('Failed to focus window:', error);
    }
  };

  const openSampleWindow = async () => {
    await WindowManager.openNewWindow({
      componentName: 'SampleWindow',
      title: `Sample ${Date.now()}`,
      width: 400,
      height: 300
    });
    refreshWindowList();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Window Manager Dashboard</Text>
      
      <Button title="Open Sample Window" onPress={openSampleWindow} />
      <Button title="Refresh List" onPress={refreshWindowList} />
      
      <Text style={styles.subtitle}>Open Windows ({windows.length})</Text>
      
      <FlatList
        data={windows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.windowItem}>
            <Text style={styles.windowTitle}>{item.title}</Text>
            <Text style={styles.windowId}>ID: {item.id}</Text>
            <View style={styles.buttonRow}>
              <Button title="Focus" onPress={() => focusWindow(item.id)} />
              <Button title="Close" onPress={() => closeWindow(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const SampleWindow = () => (
  <View style={styles.sampleWindow}>
    <Text>This is a sample window</Text>
    <Text>You can close it from the dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  windowItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  windowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  windowId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sampleWindow: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('WindowDashboard', () => WindowDashboard);
AppRegistry.registerComponent('SampleWindow', () => SampleWindow);
```

### Settings/Preferences Window

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Slider, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  darkMode: boolean;
  volume: number;
  notifications: boolean;
  autoSave: boolean;
}

const SettingsWindow = () => {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    volume: 0.5,
    notifications: true,
    autoSave: true,
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      
      // Notify other windows of settings change
      global.appSettings = newSettings;
      DeviceEventEmitter.emit('settingsChanged', newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <Text style={[styles.title, settings.darkMode && styles.darkText]}>
        Settings
      </Text>
      
      <View style={styles.setting}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch
          value={settings.darkMode}
          onValueChange={(value) => updateSetting('darkMode', value)}
        />
      </View>
      
      <View style={styles.setting}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>
          Volume: {Math.round(settings.volume * 100)}%
        </Text>
        <Slider
          style={styles.slider}
          value={settings.volume}
          onValueChange={(value) => updateSetting('volume', value)}
          minimumValue={0}
          maximumValue={1}
        />
      </View>
      
      <View style={styles.setting}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>
          Notifications
        </Text>
        <Switch
          value={settings.notifications}
          onValueChange={(value) => updateSetting('notifications', value)}
        />
      </View>
      
      <View style={styles.setting}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>
          Auto Save
        </Text>
        <Switch
          value={settings.autoSave}
          onValueChange={(value) => updateSetting('autoSave', value)}
        />
      </View>
      
      <Button title="Reset to Defaults" onPress={() => {
        const defaults = {
          darkMode: false,
          volume: 0.5,
          notifications: true,
          autoSave: true,
        };
        saveSettings(defaults);
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  slider: {
    flex: 1,
    marginLeft: 20,
  },
});

AppRegistry.registerComponent('SettingsWindow', () => SettingsWindow);
```

## Error Handling Patterns

### Robust Error Handling

```typescript
const openWindowWithErrorHandling = async (componentName: string) => {
  try {
    const windowId = await WindowManager.openNewWindow({
      componentName,
      title: 'New Window',
      width: 600,
      height: 400,
    });
    
    console.log(`Successfully opened window: ${windowId}`);
    return windowId;
    
  } catch (error) {
    // Handle specific error types
    if (error.code === 'COMPONENT_NOT_REGISTERED') {
      console.error(`Component ${componentName} not registered with AppRegistry`);
      // Show user-friendly error
      Alert.alert('Error', `Component ${componentName} not found`);
    } else if (error.code === 'WINDOW_CREATION_FAILED') {
      console.error('Failed to create native window');
      Alert.alert('Error', 'Unable to create new window');
    } else {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
    
    return null;
  }
};
```

### Window Cleanup on Error

```typescript
const WindowWithCleanup = () => {
  const [windowId, setWindowId] = useState<string | null>(null);

  useEffect(() => {
    // Store window ID for cleanup
    const currentWindowId = getCurrentWindowId(); // Implementation needed
    setWindowId(currentWindowId);

    // Cleanup on unmount or error
    return () => {
      if (currentWindowId) {
        console.log(`Cleaning up window: ${currentWindowId}`);
        // Perform cleanup tasks
      }
    };
  }, []);

  const handleError = (error: Error) => {
    console.error('Window error:', error);
    
    // Close window on critical error
    if (windowId) {
      WindowManager.closeWindow(windowId).catch(console.error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Component content */}
    </View>
  );
};
```

## Testing Patterns

### Unit Testing Window Components

```typescript
// WindowComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WindowComponent } from './WindowComponent';

// Mock the WindowManager
jest.mock('../WindowManager', () => ({
  openNewWindow: jest.fn(),
  closeWindow: jest.fn(),
}));

describe('WindowComponent', () => {
  it('should open new window when button pressed', async () => {
    const { getByText } = render(<WindowComponent />);
    
    const openButton = getByText('Open Window');
    fireEvent.press(openButton);
    
    expect(WindowManager.openNewWindow).toHaveBeenCalledWith({
      componentName: 'TestWindow',
      title: 'Test Window',
      width: 400,
      height: 300,
    });
  });
});
```

### Integration Testing

```typescript
// WindowManager.integration.test.tsx
import WindowManager from '../WindowManager';
import { AppRegistry } from 'react-native';

describe('WindowManager Integration', () => {
  beforeAll(() => {
    // Register test component
    const TestComponent = () => <View><Text>Test</Text></View>;
    AppRegistry.registerComponent('TestComponent', () => TestComponent);
  });

  it('should create and manage windows', async () => {
    const windowId = await WindowManager.openNewWindow({
      componentName: 'TestComponent',
      title: 'Integration Test',
    });

    expect(windowId).toBeTruthy();

    const windows = await WindowManager.getWindowList();
    expect(windows.some(w => w.id === windowId)).toBe(true);

    await WindowManager.closeWindow(windowId);
    
    const updatedWindows = await WindowManager.getWindowList();
    expect(updatedWindows.some(w => w.id === windowId)).toBe(false);
  });
});
```

These examples demonstrate the flexibility and power of the WindowManager module across various use cases, from simple windows to complex multi-window applications with shared state and inter-window communication.
