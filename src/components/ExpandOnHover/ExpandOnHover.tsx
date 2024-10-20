import React, { useLayoutEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  animateTrafficLightsPositionTo,
  // hideTrafficLights,
  // showTrafficLights,
} from 'react-native-infinity';
import { BlurView } from 'blurview';
import { useColors } from 'react-native-sdk';
import type { MouseEvent } from 'react-native';

const WINDOW_BORDER_SIZE = 6;
const WINDOW_BORDER_RADIUS = 6;
const OPEN_ANIMATION_DURATION = 150;
const CLOSE_ANIMATION_DURATION = 100;

const hover_targer_height = WINDOW_BORDER_SIZE * 2;
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
    borderRadius: WINDOW_BORDER_SIZE,
    paddingVertical: WINDOW_BORDER_SIZE,
  } as const;

  const childrenHeight = useRef<number>(0);
  const lastY = useRef<number>(0);
  const height = useRef(new Animated.Value(-50)).current;
  const colors = useColors();
  const [hoverHeight, setHoverHeight] = useState(hover_targer_height);

  useLayoutEffect(() => {
    console.log('Set ne ', childrenHeight.current);
  }, []);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(height, {
      toValue: 0,
      duration: OPEN_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    // Make sure its hidden
    // animateTrafficLightsPositionTo(0, 20, 0);
    // Show it
    // showTrafficLights();
    // Animate it
    animateTrafficLightsPositionTo(0, -10, 0.25);
    setHoverHeight(childrenHeight.current);
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(height, {
      toValue: -childrenHeight.current,
      duration: CLOSE_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    // Animate it
    animateTrafficLightsPositionTo(0, 20, 0.3);
    // setTimeout(() => {
    //   // Hide it
    //   hideTrafficLights();
    // }, 200);
    setHoverHeight(hover_targer_height);
  };

  if (expanded) {
    return children;
  }

  return (
    <>
      <View
        // @ts-expect-error Not sure why
        onMouseEnter={(p: MouseEvent) => {
          const screenY = p.nativeEvent.screenY;
          lastY.current = screenY;
          fadeIn();
        }}
        onMouseLeave={(p: MouseEvent) => {
          const screenY = p.nativeEvent.screenY;
          if (screenY > lastY.current) {
            // console.log('Pointer left from the top');
          } else {
            // console.log('Pointer left from the bottom');
            fadeOut();
          }
        }}
        style={{
          ...StyleSheet.absoluteFillObject,
          bottom: undefined,
          height: hoverHeight,
          // backgroundColor: 'rgba(255, 0, 0, 0.2)',
        }}
      />
      <Animated.View
        // hitSlop={{ top: 100, left: 0, right: 0, bottom: 0 }}
        style={[
          st,
          {
            zIndex: 2,
            borderColor: colors.strokeColorCardStrokeDefault,
            borderBottomWidth: 1,
            backgroundColor: colors.backgroundFillColorSolidBackgroundSecondary,
            borderRadius: WINDOW_BORDER_RADIUS,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: height.interpolate({
              inputRange: [-48, 48],
              outputRange: [0, 0.6],
            }),
            shadowRadius: 4,
          },
          { transform: [{ translateY: height }] },
        ]}
        onLayout={event => {
          const h = event.nativeEvent.layout.height;
          console.log('Tabbar height: ', h);
          childrenHeight.current = h + 1;
        }}>
        <BlurView style={HH}>{children}</BlurView>
      </Animated.View>
    </>
  );
};
