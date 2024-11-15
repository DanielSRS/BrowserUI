import { BlurView } from 'blurview';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import {
  BUTTUN_SIZE,
  TITLEBAR_SIZE,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Tab } from './components/Tab';

const TABS = [{ id: 13 }, { id: 14 }] as const;
const TABBAR_EXPANDED_WIDTH = 250;
const OPEN_ANIMATION_DURATION = 50;
const CLOSE_ANIMATION_DURATION = 150;
// const DELAY_TO_EXPAND = 1000;

interface TabbarProps {
  //
}
export function Tabbar(props: TabbarProps) {
  const {} = props;
  const [isHovered, setIsHovered] = useState(false);
  const tabbarWidth = useRef(new Animated.Value(TABBAR_COLAPSED_WIDTH));
  const BV = useMemo(() => (isHovered ? BlurView : View), [isHovered]);

  const expand = () => {
    setIsHovered(true);
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(tabbarWidth.current, {
      toValue: TABBAR_EXPANDED_WIDTH,
      duration: OPEN_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  };

  const colapse = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(tabbarWidth.current, {
      toValue: TABBAR_COLAPSED_WIDTH,
      duration: CLOSE_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setIsHovered(false);
    });
  };

  return (
    <View style={tabbarContainer}>
      {isHovered && <View style={minSideBar} />}
      <Animated.View
        // @ts-expect-error
        onMouseEnter={(_p: MouseEvent) => {
          expand();
        }}
        key={isHovered ? 'A' : 'B'}
        onMouseLeave={(_p: MouseEvent) => {
          colapse();
        }}
        style={[
          sideBar,
          isHovered ? StyleSheet.absoluteFill : undefined,
          isHovered
            ? {
                // backgroundColor: 'rgba(255, 0, 0, 0.5)',
                maxWidth: TABBAR_EXPANDED_WIDTH,
                // paddingRight: WINDOW_BORDER_SIZE,
                width: tabbarWidth.current,
              }
            : undefined,
        ]}>
        <BV
          style={[
            { paddingRight: isHovered ? WINDOW_BORDER_SIZE : undefined },
            fatlist,
          ]}>
          <FlatList
            data={TABS}
            contentContainerStyle={fatlistContent}
            renderItem={({ item }) => <Tab {...item} />}
          />
        </BV>
      </Animated.View>
    </View>
  );
}

const tabbarContainer = { zIndex: 3 } as const;

const sideBar = {
  // backgroundColor: 'red',
  borderRadius: WINDOW_BORDER_SIZE,
  overflow: 'hidden',
  paddingTop: 0,
  // backgroundColor: 'blue',
  maxWidth: BUTTUN_SIZE,
  minWidth: BUTTUN_SIZE,
  flex: 1,
  // maxWidth: 50,
} as const;

const minSideBar = {
  minWidth: BUTTUN_SIZE,
} as const;

const fatlist = {
  flex: 1,
  marginTop: -TITLEBAR_SIZE,
} as const;

const TABLIST_GAP = 3;
const fatlistContent = {
  rowGap: TABLIST_GAP,
} as const;
/**
 * When this value is used, sidebar is absolute positioned, so
 * its needed compensate right padding not being aplied with
 * WINDOW_BORDER_SIZE
 */
const TABBAR_COLAPSED_WIDTH = BUTTUN_SIZE + WINDOW_BORDER_SIZE;
