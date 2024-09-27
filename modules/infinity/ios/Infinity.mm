#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Infinity, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hideTitleBar)

RCT_EXTERN_METHOD(hideTrafficLights)

RCT_EXTERN_METHOD(showTitleBar)

RCT_EXTERN_METHOD(showTrafficLights)

RCT_EXPORT_METHOD(animateTrafficLights:(double)x y:(double)y duration:(double)duration)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [NSApp mainWindow];
    
    NSButton *closeButton = [window standardWindowButton:NSWindowCloseButton];
    NSButton *minimizeButton = [window standardWindowButton:NSWindowMiniaturizeButton];
    NSButton *zoomButton = [window standardWindowButton:NSWindowZoomButton];
    
    NSArray *buttons = @[closeButton, minimizeButton, zoomButton];
    
    [NSAnimationContext runAnimationGroup:^(NSAnimationContext *context) {
      context.duration = duration;
      for (NSButton *button in buttons) {
        NSRect frame = [button frame];
        frame.origin.x += x;
        frame.origin.y += y;
        [[button animator] setFrame:frame];
      }
    } completionHandler:nil];
  });
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
