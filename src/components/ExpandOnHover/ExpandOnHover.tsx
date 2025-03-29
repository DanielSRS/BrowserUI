import React, { useLayoutEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  animateTrafficLightsPositionTo,
  changeTrafficLightsPosition,
  hideTrafficLights,
  showTrafficLights,
  // hideTrafficLights,
  // showTrafficLights,
} from 'react-native-infinity';
import { BlurView } from 'blurview';
import { Styled, useColors } from '@danielsrs/react-native-sdk';
import { ExpandOnHoverContext } from './ExpandOnHover.context';
import { settings } from '../../store/store';
import type { MouseEvent } from 'react-native';

const WINDOW_BORDER_SIZE = 6;
const WINDOW_BORDER_RADIUS = 6;
const OPEN_ANIMATION_DURATION = 150;
const CLOSE_ANIMATION_DURATION = 100;
const BUTTONS_START_POSITION = 6 + 10; // window border size + tab icon padding

const hover_targer_height = WINDOW_BORDER_SIZE * 2;
export const ExpandOnHover = (props: {
  children: React.ReactNode;
  expanded?: boolean;
}) => {
  const { children, expanded } = props;
  const onRenderExpanded = useRef(expanded);
  const childrenHeight = useRef<number>(0);
  const lastY = useRef<number>(0);
  const height = useRef(new Animated.Value(-50)).current;
  const colors = useColors();
  const [hoverHeight, setHoverHeight] = useState(hover_targer_height);
  const focusCount = useRef(0);

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
    if (!settings.isTopBarExpanded.peek()) {
      changeTrafficLightsPosition(BUTTONS_START_POSITION, 14);
      showTrafficLights();
    }
    // Animate it
    animateTrafficLightsPositionTo(0, -17, 0.25);
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
    animateTrafficLightsPositionTo(0, 20, 0.3).then(() => {
      if (!settings.isTopBarExpanded.peek()) {
        hideTrafficLights();
      }
    });
    // setTimeout(() => {
    //   // Hide it
    //   hideTrafficLights();
    // }, 200);
    setHoverHeight(hover_targer_height);
  };

  if (onRenderExpanded.current !== expanded) {
    // console.log('expanded changed: ', onRenderExpanded.current, expanded);
    // change
    if (!expanded) {
      closeIfNotFocused();
    } else {
      // fadeIn();
    }
    // end change
    // update ref
    onRenderExpanded.current = expanded;
  }

  if (expanded) {
    return <VerticalPadding>{children}</VerticalPadding>;
  }

  const incrementFocusCount = () => {
    focusCount.current++;
  };

  const decrementFocusCount = () => {
    focusCount.current--;
  };

  const decrementFocusCountAnd = (fn: () => void) => () => {
    decrementFocusCount();
    fn();
  };

  function closeIfNotFocused() {
    if (focusCount.current === 0) {
      fadeOut();
    }
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
            closeIfNotFocused();
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
            backgroundColor: colors.appBackground,
            borderRadius: WINDOW_BORDER_RADIUS,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: height.interpolate({
              inputRange: [-48, 48],
              outputRange: [0, 0.3],
            }),
            shadowRadius: 2,
          },
          { transform: [{ translateY: height }] },
        ]}
        onLayout={event => {
          const h = event.nativeEvent.layout.height;
          // console.log('Tabbar height: ', h);
          childrenHeight.current = h + 1;
        }}>
        <View
          style={{
            borderColor: colors.strokeColorSurfaceStrokeDefault,
            borderBottomWidth: 1,
            marginBottom: -1,
            overflow: 'hidden',
            borderRadius: WINDOW_BORDER_RADIUS,
          }}>
          <ExpandOnHoverContext.Provider
            value={{
              onInnerBlur: decrementFocusCountAnd(closeIfNotFocused),
              onInnerFocus: incrementFocusCount,
            }}>
            <BlurView style={HH}>{children}</BlurView>
          </ExpandOnHoverContext.Provider>
        </View>
      </Animated.View>
    </>
  );
};

const VerticalPadding = Styled.createStyledView({
  paddingVertical: WINDOW_BORDER_SIZE,
});

const st = {
  ...StyleSheet.absoluteFillObject,
  overflow: 'hidden',
  bottom: undefined,
} as const;
const HH = {
  borderRadius: WINDOW_BORDER_SIZE,
  paddingVertical: WINDOW_BORDER_SIZE,
} as const;
