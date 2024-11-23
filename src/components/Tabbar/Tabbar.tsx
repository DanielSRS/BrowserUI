import { BlurView } from 'blurview';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
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
import type { TabbarProps } from './Tabbar.types';

const TABBAR_EXPANDED_WIDTH = 250;
const OPEN_ANIMATION_DURATION = 100;
const CLOSE_ANIMATION_DURATION = 100;
// const DELAY_TO_EXPAND = 1000;

export const Tabbar = memo(function Tabbar(props: TabbarProps) {
  const {} = props;
  const {
    tabList,
    //
  } = props.useTabsData ? props.useTabsData(props) : props;
  /**
   * 0: colapsed
   * 1: expanding
   * 2: expanded
   * 3: colapsing
   */
  const [state, setState] = useState<0 | 1 | 2 | 3>(0);
  const tabbarWidth = useRef(new Animated.Value(TABBAR_COLAPSED_WIDTH));
  const scheduledId = useRef<NodeJS.Timeout>();

  const expand = useCallback(() => {
    /**
     * Se estiver aberto ou abrindo não faz nada
     */
    if (state === 1 || state === 2) {
      return;
    }
    console.log('expand');
    clearTimeout(scheduledId.current);
    tabbarWidth.current.stopAnimation();

    scheduledId.current = setTimeout(() => {
      setState(1);
      // Will change fadeAnim value to 1 in 5 seconds
      Animated.timing(tabbarWidth.current, {
        toValue: TABBAR_EXPANDED_WIDTH,
        duration: OPEN_ANIMATION_DURATION,
        isInteraction: true,
        useNativeDriver: false,
        // mass: 1,
        // damping: 600,
        // stiffness: 800,
        // bounciness: 100,
        // speed: 20,
      }).start(() => {
        setState(2);
      });
    }, DELAY_TO_OPEN_TABBAR);
  }, [state]);

  const colapse = useCallback(() => {
    console.log('colapse');
    // Stop openning schedule if any
    clearTimeout(scheduledId.current);
    tabbarWidth.current.stopAnimation();
    setState(3);

    scheduledId.current = setTimeout(() => {
      // Will change fadeAnim value to 0 in CLOSE_ANIMATION_DURATION
      Animated.timing(tabbarWidth.current, {
        toValue: TABBAR_COLAPSED_WIDTH,
        duration: CLOSE_ANIMATION_DURATION,
        useNativeDriver: false,
      }).start(() => {
        setState(0);
      });
    }, 10);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof tabList)['0'] }) => <Tab {...item} />,
    [],
  );

  return (
    <TabbarContainer>
      {/* Expandable view */}
      {state > 0 && (
        <View
          // @ts-expect-error
          onMouseLeave={colapse}
          style={{
            // backgroundColor: 'red',
            ...StyleSheet.absoluteFillObject,
            width: TABBAR_EXPANDED_WIDTH + 2,
            right: undefined,
          }}
        />
      )}
      <Animated.View
        // @ts-expect-error
        onMouseEnter={expand}
        // onMouseLeave={colapse}
        style={[sideBar, { width: tabbarWidth.current }]}>
        {/* Blurred background */}
        {state > 0 && <BlurView style={[StyleSheet.absoluteFill]} />}

        {/* Tab list */}
        <FlatList
          data={tabList}
          style={fatlist}
          contentContainerStyle={fatlistContent}
          renderItem={renderItem}
        />
        <NewButtonContainer>
          <NewTabButton />
        </NewButtonContainer>
      </Animated.View>
    </TabbarContainer>
  );
});

const TabbarContainer = memo(
  Styled.createStyledView(
    {
      zIndex: 3,
      flex: 1,
    },
    'TabbarContainer',
  ),
);

const NewButtonContainer = memo(
  Styled.createStyledView(
    {
      padding: WINDOW_BORDER_SIZE,
    },
    'NewButtonContainer',
  ),
);

const sideBar = {
  // backgroundColor: 'red',
  borderRadius: WINDOW_BORDER_SIZE,
  flex: 1,
} as const;
const fatlist = {
  flex: 1,
  // marginTop: -TITLEBAR_SIZE - WINDOW_BORDER_SIZE,
  // backgroundColor: 'rgba(255, 0, 0, 0.1)',
} as const;

const fatlistContent = {
  padding: WINDOW_BORDER_SIZE,
  paddingBottom: 0,
  rowGap: TABLIST_GAP,
  // borderWidth: 1,
} as const;
