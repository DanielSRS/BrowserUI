import { BlurView } from 'blurview';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet } from 'react-native';
import {
  TABBAR_COLAPSED_WIDTH,
  TABLIST_GAP,
  TITLEBAR_SIZE,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Tab } from './components/Tab';
import { Styled } from 'react-native-sdk';
import { NewTabButton } from './components/NewTabButton';

const TABS = [{ id: 13 }, { id: 14 }, { id: 15 }] as const;
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
    <TabbarContainer>
      {/* Expandable view */}
      <Animated.View
        // @ts-expect-error
        onMouseEnter={(_p: MouseEvent) => {
          expand();
        }}
        onMouseLeave={(_p: MouseEvent) => {
          colapse();
        }}
        style={[sideBar, { width: tabbarWidth.current }]}>
        {/* Blurred background */}
        {isHovered && <BlurView style={[StyleSheet.absoluteFill]} />}

        {/* Tab list */}
        <FlatList
          data={TABS}
          style={fatlist}
          contentContainerStyle={fatlistContent}
          renderItem={({ item }) => <Tab {...item} />}
        />
        <NewTabButton />
      </Animated.View>
    </TabbarContainer>
  );
}

const TabbarContainer = Styled.createStyledView({
  zIndex: 3,
});

const sideBar = {
  // backgroundColor: 'red',
  borderRadius: WINDOW_BORDER_SIZE,
  padding: WINDOW_BORDER_SIZE,
  flex: 1,
} as const;
const fatlist = {
  flex: 1,
  marginTop: -TITLEBAR_SIZE - WINDOW_BORDER_SIZE,
  // backgroundColor: 'rgba(255, 0, 0, 0.1)',
} as const;

const fatlistContent = {
  rowGap: TABLIST_GAP,
} as const;
