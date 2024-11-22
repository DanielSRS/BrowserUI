import { BlurView } from 'blurview';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet } from 'react-native';
import {
  DELAY_TO_OPEN_TABBAR,
  TABBAR_COLAPSED_WIDTH,
  TABLIST_GAP,
  // TITLEBAR_SIZE,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Tab } from './components/Tab';
import { Styled } from 'react-native-sdk';
import { NewTabButton } from './components/NewTabButton';

const TABS = [
  { id: 13, name: 'New Tab' },
  { id: 14, name: 'New Tab' },
  { id: 15, name: 'New Tab' },
] as const;
const TABBAR_EXPANDED_WIDTH = 250;
// const OPEN_ANIMATION_DURATION = 100;
const CLOSE_ANIMATION_DURATION = 150;
// const DELAY_TO_EXPAND = 1000;

interface TabbarProps {
  //
}
export function Tabbar(props: TabbarProps) {
  const {} = props;
  const [isHovered, setIsHovered] = useState(false);
  const tabbarWidth = useRef(new Animated.Value(TABBAR_COLAPSED_WIDTH));
  const scheduledId = useRef<NodeJS.Timeout>();

  const expand = () => {
    clearTimeout(scheduledId.current);

    scheduledId.current = setTimeout(() => {
      setIsHovered(true);
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.spring(tabbarWidth.current, {
        toValue: TABBAR_EXPANDED_WIDTH,
        // duration: OPEN_ANIMATION_DURATION,
        isInteraction: true,
        useNativeDriver: false,
        // mass: 1,
        // damping: 600,
        // stiffness: 800,
        bounciness: 100,
        speed: 20,
      }).start();
    }, DELAY_TO_OPEN_TABBAR);
  };

  const colapse = () => {
    // Stop openning schedule if any
    clearTimeout(scheduledId.current);

    scheduledId.current = setTimeout(() => {
      // Will change fadeAnim value to 0 in CLOSE_ANIMATION_DURATION
      Animated.timing(tabbarWidth.current, {
        toValue: TABBAR_COLAPSED_WIDTH,
        duration: CLOSE_ANIMATION_DURATION,
        useNativeDriver: false,
      }).start(() => {
        setIsHovered(false);
      });
    }, 10);
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
  flex: 1,
});

const sideBar = {
  // backgroundColor: 'red',
  borderRadius: WINDOW_BORDER_SIZE,
  padding: WINDOW_BORDER_SIZE,
  flex: 1,
} as const;
const fatlist = {
  flex: 1,
  // marginTop: -TITLEBAR_SIZE - WINDOW_BORDER_SIZE,
  // backgroundColor: 'rgba(255, 0, 0, 0.1)',
} as const;

const fatlistContent = {
  rowGap: TABLIST_GAP,
} as const;
