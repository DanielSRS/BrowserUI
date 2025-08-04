import Cocoa
import React

@objc(WindowManager)
class WindowManager: NSObject {
    internal var managedWindows: [String: NSWindow] = [:]
    internal var windowDelegates: [String: WindowDelegate] = [:]
    private var bridge: RCTBridge?
    
    // MARK: - Window Management
    
    @objc(openNewWindow:withResolver:withRejecter:)
    func openNewWindow(options: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let windowId = UUID().uuidString
                let window = try self.createNewWindow(options: options, windowId: windowId)
                self.managedWindows[windowId] = window
                resolve(windowId)
            } catch {
                reject("WINDOW_CREATION_FAILED", "Failed to create new window", error)
            }
        }
    }
    
    @objc(closeWindow:withResolver:withRejecter:)
    func closeWindow(windowId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            window.close()
            self.managedWindows.removeValue(forKey: windowId)
            self.windowDelegates.removeValue(forKey: windowId)
            resolve(nil)
        }
    }
    
    @objc(focusWindow:withResolver:withRejecter:)
    func focusWindow(windowId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            resolve(nil)
        }
    }
    
    @objc(setWindowTitle:title:withResolver:withRejecter:)
    func setWindowTitle(windowId: String, title: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            window.title = title
            resolve(nil)
        }
    }
    
    @objc(resizeWindow:width:height:withResolver:withRejecter:)
    func resizeWindow(windowId: String, width: Double, height: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            let currentFrame = window.frame
            let newFrame = NSRect(x: currentFrame.origin.x, y: currentFrame.origin.y, width: CGFloat(width), height: CGFloat(height))
            window.setFrame(newFrame, display: true, animate: true)
            resolve(nil)
        }
    }
    
    @objc(moveWindow:x:y:withResolver:withRejecter:)
    func moveWindow(windowId: String, x: Double, y: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            let currentFrame = window.frame
            let newFrame = NSRect(x: CGFloat(x), y: CGFloat(y), width: currentFrame.size.width, height: currentFrame.size.height)
            window.setFrame(newFrame, display: true, animate: true)
            resolve(nil)
        }
    }
    
    @objc(minimizeWindow:withResolver:withRejecter:)
    func minimizeWindow(windowId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            window.miniaturize(nil)
            resolve(nil)
        }
    }
    
    @objc(maximizeWindow:withResolver:withRejecter:)
    func maximizeWindow(windowId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            if window.isZoomed {
                window.zoom(nil)
            } else {
                window.zoom(nil)
            }
            resolve(nil)
        }
    }
    
    @objc(getWindowList:withRejecter:)
    func getWindowList(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            var windowList: [[String: String]] = []
            
            for (id, window) in self.managedWindows {
                windowList.append([
                    "id": id,
                    "title": window.title
                ])
            }
            
            resolve(windowList)
        }
    }
    
    @objc(setWindowAlwaysOnTop:alwaysOnTop:withResolver:withRejecter:)
    func setWindowAlwaysOnTop(windowId: String, alwaysOnTop: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = self.managedWindows[windowId] else {
                reject("WINDOW_NOT_FOUND", "Window with ID \(windowId) not found", nil)
                return
            }
            
            window.level = alwaysOnTop ? .floating : .normal
            resolve(nil)
        }
    }
    
    // MARK: - Private Methods
    
    private func createNewWindow(options: [String: Any], windowId: String) throws -> NSWindow {
        // Default window options
        let width = options["width"] as? Double ?? 800
        let height = options["height"] as? Double ?? 600
        let x = options["x"] as? Double ?? 100
        let y = options["y"] as? Double ?? 100
        let title = options["title"] as? String ?? "New Window"
        let resizable = options["resizable"] as? Bool ?? true
        let minimizable = options["minimizable"] as? Bool ?? true
        let _ = options["maximizable"] as? Bool ?? true
        let closable = options["closable"] as? Bool ?? true
        let alwaysOnTop = options["alwaysOnTop"] as? Bool ?? false
        let fullscreen = options["fullscreen"] as? Bool ?? false
        let componentName = options["componentName"] as? String ?? "DefaultWindowContent"
        let initialProps = options["initialProps"] as? [String: Any]
        
        // Create window frame
        let windowRect = NSRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
        
        // Configure window style mask
        var styleMask: NSWindow.StyleMask = [.titled]
        if resizable { styleMask.insert(.resizable) }
        if minimizable { styleMask.insert(.miniaturizable) }
        if closable { styleMask.insert(.closable) }
        
        // Create the window
        let window = NSWindow(contentRect: windowRect, styleMask: styleMask, backing: .buffered, defer: false)
        window.title = title
        window.isReleasedWhenClosed = false
        
        // Set window properties
        if alwaysOnTop {
            window.level = .floating
        }
        
        // Create React Native content view
        let reactNativeView = createReactNativeView(componentName: componentName, initialProps: initialProps, windowId: windowId, frame: window.contentView!.bounds)
        window.contentView = reactNativeView
        
        // Set up window delegate to handle cleanup
        let delegate = WindowDelegate(windowId: windowId, windowManager: self)
        window.delegate = delegate
        self.windowDelegates[windowId] = delegate
        
        // Show window
        window.makeKeyAndOrderFront(nil)
        
        if fullscreen {
            window.toggleFullScreen(nil)
        }
        
        return window
    }
    
    private func createReactNativeView(componentName: String, initialProps: [String: Any]?, windowId: String, frame: NSRect) -> NSView {
        // Get the main bridge from the current React Native instance
        guard let bridge = RCTBridge.current() else {
            // Fallback to a simple view if bridge is not available
            let fallbackView = NSView(frame: frame)
            fallbackView.wantsLayer = true
            fallbackView.layer?.backgroundColor = NSColor.windowBackgroundColor.cgColor
            
            let label = NSTextField(labelWithString: "React Native Bridge not available")
            label.alignment = .center
            label.frame = NSRect(x: 0, y: frame.height/2 - 20, width: frame.width, height: 40)
            label.autoresizingMask = [.minXMargin, .maxXMargin, .minYMargin, .maxYMargin]
            fallbackView.addSubview(label)
            
            return fallbackView
        }
        
        // Create a new RCTRootView for the component
        let rootView = RCTRootView(
            bridge: bridge,
            moduleName: componentName,
            initialProperties: initialProps
        )
        
        rootView.frame = frame
        rootView.autoresizingMask = [.width, .height]
        rootView.backgroundColor = NSColor.windowBackgroundColor
        
        // Create a container view
        let containerView = NSView(frame: frame)
        containerView.wantsLayer = true
        containerView.addSubview(rootView)
        
        return containerView
    }
}

// MARK: - Window Delegate

class WindowDelegate: NSObject, NSWindowDelegate {
    private let windowId: String
    private weak var windowManager: WindowManager?
    
    init(windowId: String, windowManager: WindowManager) {
        self.windowId = windowId
        self.windowManager = windowManager
        super.init()
    }
    
    func windowWillClose(_ notification: Notification) {
        // Clean up the window reference when it's closed
        windowManager?.managedWindows.removeValue(forKey: windowId)
        windowManager?.windowDelegates.removeValue(forKey: windowId)
    }
}
