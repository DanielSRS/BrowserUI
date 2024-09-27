#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"BrowserUI";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  /**
   *  Use a notification observer to modify the window properties once the window has been created.
   */
  [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowDidBecomeKey:)
                                                 name:NSWindowDidBecomeKeyNotification
                                               object:nil];

  return [super applicationDidFinishLaunching:notification];
}

/**
 * Ensures that the window is fully initialized and has become the key window before you attempt to modify its properties
 */
- (void)windowDidBecomeKey:(NSNotification *)notification
{
  NSWindow *window = notification.object;
  [window setTitleVisibility:NSWindowTitleHidden];
  [window setTitlebarAppearsTransparent:YES];
  [window setStyleMask:[window styleMask] | NSWindowStyleMaskFullSizeContentView];
  
  // Hide the close button
  [[window standardWindowButton:NSWindowCloseButton] setHidden:YES];
  // Hide the minimize button
  [[window standardWindowButton:NSWindowMiniaturizeButton] setHidden:YES];
  // Hide the maximize button
  [[window standardWindowButton:NSWindowZoomButton] setHidden:YES];
  
  // Remove the observer
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:NSWindowDidBecomeKeyNotification
                                                object:nil];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
  return true;
#else
  return false;
#endif
}

@end
