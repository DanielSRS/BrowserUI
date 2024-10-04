#import <React/RCTViewManager.h>
#import <Cocoa/Cocoa.h>

@interface BlurView : NSVisualEffectView
@end

@implementation BlurView
- (instancetype)initWithFrame:(NSRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    self.blendingMode = NSVisualEffectBlendingModeBehindWindow;
    self.material = NSVisualEffectMaterialTitlebar;
    self.state = NSVisualEffectStateActive;
  }
  return self;
}
@end

@interface BlurViewManager : RCTViewManager
@end

@implementation BlurViewManager

RCT_EXPORT_MODULE(BlurView)

- (NSView *)view {
  return [[BlurView alloc] init];
}

@end
