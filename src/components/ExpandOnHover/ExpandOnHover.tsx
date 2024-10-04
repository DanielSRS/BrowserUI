import React, { useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import {
  animateTrafficLightsPositionTo,
  hideTrafficLights,
  showTrafficLights,
} from 'react-native-infinity';
import { BlurView } from 'blurview';

const WINDOW_BORDER_SIZE = 6;

export const ExpandOnHover = (props: {
  children: React.ReactNode;
  expanded?: boolean;
}) => {
  const { children, expanded } = props;
  const st = {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    bottom: undefined,
  } as const;
  const HH = {
    paddingVertical: WINDOW_BORDER_SIZE,
  } as const;

  const childrenHeight = useRef<number>(0);
  const height = useRef(new Animated.Value(-50)).current;

  useLayoutEffect(() => {
    console.log('Set ne ', childrenHeight.current);
  }, []);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(height, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Make sure its hidden
    // animateTrafficLightsPositionTo(0, 20, 0);
    // Show it
    showTrafficLights();
    // Animate it
    animateTrafficLightsPositionTo(0, -10, 0.25);
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(height, {
      toValue: -childrenHeight.current,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Animate it
    animateTrafficLightsPositionTo(0, 20, 0.3);
    setTimeout(() => {
      // Hide it
      hideTrafficLights();
    }, 200);
  };

  if (expanded) {
    return children;
  }

  return (
    <Animated.View
      hitSlop={{ top: 100, left: 0, right: 0, bottom: 0 }}
      style={[
        st,
        {
          zIndex: 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderBottomWidth: 1,
        },
        { transform: [{ translateY: height }] },
      ]}
      // @ts-expect-error Not sure why
      onMouseEnter={() => {
        console.log('enter');
        fadeIn();
      }}
      onMouseLeave={() => {
        console.log('leave');
        fadeOut();
      }}
      onPointerMove={() => console.log('move?')}
      onMouseCapture={() => console.log('onMouseCapture?')}
      onMouseMove={() => console.log('onMouseMove?')}
      onLayout={event => {
        const h = event.nativeEvent.layout.height;
        console.log('Tabbar height: ', h);
        childrenHeight.current = h + 1;
      }}>
      <BlurView style={HH}>{children}</BlurView>
    </Animated.View>
  );
};
