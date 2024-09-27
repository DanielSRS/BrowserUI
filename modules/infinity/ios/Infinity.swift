import Cocoa
import React

@objc(Infinity)
class Infinity: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
    
  @objc(hideTitleBar)
  func hideTitleBar() {
    DispatchQueue.main.async {
      if let window = NSApplication.shared.mainWindow {
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.styleMask.insert(.fullSizeContentView)
      }
    }
  }
  
  @objc(showTitleBar)
  func showTitleBar() {
    DispatchQueue.main.async {
      if let window = NSApplication.shared.mainWindow {
          window.titleVisibility = .visible
        window.titlebarAppearsTransparent = false
        window.styleMask.remove(.fullSizeContentView)
      }
    }
  }
    
  @objc(hideTrafficLights)
  func hideTrafficLights() {
    DispatchQueue.main.async {
      if let window = NSApplication.shared.mainWindow {
        // Hide traffic lights
        if let standardWindowButton = window.standardWindowButton(.closeButton) {
          standardWindowButton.isHidden = true
        }
        if let standardWindowButton = window.standardWindowButton(.miniaturizeButton) {
          standardWindowButton.isHidden = true
        }
        if let standardWindowButton = window.standardWindowButton(.zoomButton) {
          standardWindowButton.isHidden = true
        }
      }
    }
  }
    
  @objc(showTrafficLights)
  func showTrafficLights() {
    DispatchQueue.main.async {
      if let window = NSApplication.shared.mainWindow {
        // Hide traffic lights
        if let standardWindowButton = window.standardWindowButton(.closeButton) {
          standardWindowButton.isHidden = false
        }
        if let standardWindowButton = window.standardWindowButton(.miniaturizeButton) {
          standardWindowButton.isHidden = false
        }
        if let standardWindowButton = window.standardWindowButton(.zoomButton) {
          standardWindowButton.isHidden = false
        }
      }
    }
  }
}
