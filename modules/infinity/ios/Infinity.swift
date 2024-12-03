import Cocoa
import React

@objc(Infinity)
class Infinity: NSObject {
  private var buttonsX: CGFloat = 0.0
  private var buttonsY: CGFloat = 0.0

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

  @objc(animateTrafficLights:y:duration:)
  func animateTrafficLights(x: Double, y: Double, duration: Double) -> Void {
    DispatchQueue.main.async {
      guard let window = NSApp.mainWindow else { return }
      
      let closeButton = window.standardWindowButton(.closeButton)
      let minimizeButton = window.standardWindowButton(.miniaturizeButton)
      let zoomButton = window.standardWindowButton(.zoomButton)
      
      let buttons = [closeButton, minimizeButton, zoomButton]
      
      NSAnimationContext.runAnimationGroup { context in
        context.duration = duration
        for button in buttons {
          if let button = button {
            var frame = button.frame
            frame.origin.x += CGFloat(x)
            frame.origin.y += CGFloat(y)
            button.animator().setFrameOrigin(frame.origin)
          }
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

  private func getInitialPos() {
    DispatchQueue.main.async {
      if let window = NSApplication.shared.mainWindow {
        let closeButton = window.standardWindowButton(.closeButton)
        let miniaturizeButton = window.standardWindowButton(.miniaturizeButton)
        let zoomButton = window.standardWindowButton(.zoomButton)

        guard let closeButtonFrame = closeButton?.frame,
              let miniaturizeButtonFrame = miniaturizeButton?.frame,
              let zoomButtonFrame = zoomButton?.frame else {
          return
        }
          
          self.buttonsY = closeButtonFrame.origin.y
      }
    }
  }
    
  @objc(getButtonPositions:withRejecter:)
  func getButtonPositions(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let positions: [String: CGFloat] = ["buttonsX": self.buttonsX, "buttonsY": self.buttonsY]
    resolve(positions)
  }
}
