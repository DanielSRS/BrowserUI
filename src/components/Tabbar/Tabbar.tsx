import { BlurView } from 'blurview';
import React, { memo, useCallback, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import {
  TABBAR_COLAPSED_WIDTH,
  TABLIST_GAP,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Tab } from './components/Tab';
import { Styled } from 'react-native-sdk';
import { NewTabButton } from './components/NewTabButton';
import type { TabbarProps } from './Tabbar.types';

const TABBAR_EXPANDED_WIDTH = 250;
// const OPEN_ANIMATION_DURATION = 100;
// const CLOSE_ANIMATION_DURATION = 100;
// const DELAY_TO_EXPAND = 1000;

export const Tabbar = memo(function Tabbar(props: TabbarProps) {
  const {} = props;
  const {
    tabList,
    //
  } = props.useTabsData ? props.useTabsData(props) : props;
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = useCallback(() => {
    if (isExpanded) {
      return;
    }
    setIsExpanded(true);
  }, [isExpanded]);

  const colapse = useCallback(() => {
    if (!isExpanded) {
      return;
    }
    setIsExpanded(false);
  }, [isExpanded]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof tabList)['0'] }) => <Tab {...item} />,
    [],
  );

  return (
    <TabbarContainer>
      {/* Expandable view */}
      {isExpanded && (
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
        style={[
          sideBar,
          { width: isExpanded ? TABBAR_EXPANDED_WIDTH : TABBAR_COLAPSED_WIDTH },
        ]}>
        {/* Blurred background */}
        {isExpanded && <BlurView style={[StyleSheet.absoluteFill]} />}

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
