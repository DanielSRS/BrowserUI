#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Infinity, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hideTitleBar)

RCT_EXTERN_METHOD(hideTrafficLights)

RCT_EXTERN_METHOD(showTitleBar)

RCT_EXTERN_METHOD(animateTrafficLights:(double)x y:(double)y duration:(double)duration)


RCT_EXTERN_METHOD(showTrafficLights)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
