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
import { Memo } from '@legendapp/state/react';
import type { Tab as TAB, Workspace } from '../../store/store';
import type { TabbarProps } from './Tabbar.types';
import type { Observable } from '@legendapp/state';

const TABBAR_EXPANDED_WIDTH = 250;
// const OPEN_ANIMATION_DURATION = 100;
// const CLOSE_ANIMATION_DURATION = 100;
// const DELAY_TO_EXPAND = 1000;

export function Tabbar(props: TabbarProps) {
  const { workspace } = props;
  const {} = props.useTabsData ? props.useTabsData(props) : props;
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
          {
            width: isExpanded ? TABBAR_EXPANDED_WIDTH : TABBAR_COLAPSED_WIDTH,
          },
        ]}>
        {/* Blurred background */}
        {isExpanded && <BlurView style={[StyleSheet.absoluteFill]} />}

        {/* Tab list */}
        <Memo>
          {() => (
            <FlatList
              data={workspace.tabs.get()}
              style={fatlist}
              contentContainerStyle={fatlistContent}
              renderItem={renderItem(workspace)}
              showsVerticalScrollIndicator={isExpanded}
              // extraData={workspace.tabs.length}
            />
          )}
        </Memo>

        <Memo>
          {() => (
            <NewButtonContainer>
              <NewTabButton onPress={workspace.openNewTab} />
            </NewButtonContainer>
          )}
        </Memo>
      </Animated.View>
    </TabbarContainer>
  );
}

const renderItem =
  (workspace: Observable<Workspace>) =>
  ({ item }: { item: TAB }) =>
    (
      <Memo>
        {() => (
          <Tab
            {...item}
            key={item.id}
            onPress={() => workspace.selectTab?.(item.id)}
            onClose={() => workspace.closeTab?.(item.id)}
            selectedTabId={workspace.selectedTabId}
          />
        )}
      </Memo>
    );

const TabbarContainer = memo(
  Styled.createStyledView(
    {
      zIndex: 3,
      height: '100%',
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
