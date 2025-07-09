import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import {
  TABBAR_COLAPSED_WIDTH,
  TABLIST_GAP,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Memo, useObservable } from '@legendapp/state/react';
import { Styled } from '@danielsrs/react-native-sdk';
import { BlurView } from 'blurview';
import { NewTabButton } from './components/NewTabButton';
import { Tab } from './components/Tab';
import { LegendList } from '@legendapp/list';
import type { Observable, ObservablePrimitive } from '@legendapp/state';
import type { Tab as TAB } from '../../store/store';
import type { LegendListRef } from '@legendapp/list';

const TABBAR_EXPANDED_WIDTH = 250;
const OPEN_ANIMATION_SPEED = 100;
const CLOSE_ANIMATION_SPEED = 250;
const DELAY_TO_EXPAND = 40;

const interpolationConfig = {
  inputRange: [TABBAR_COLAPSED_WIDTH, TABBAR_COLAPSED_WIDTH + 8],
  outputRange: [0, 1],
  easing: Easing.ease,
};

interface TabbarProps {
  onNewTabButtonPress?: () => void;
  tabs: Observable<Record<number, TAB>>;
  tabIds: Observable<string[]>;
  selectTab?: (id: number) => void;
  closeTab?: (id: number) => void;
  selectedTabId: ObservablePrimitive<number>;
}
export function Tabbar(props: TabbarProps) {
  const {
    tabs,
    onNewTabButtonPress,
    selectedTabId,
    closeTab,
    selectTab,
    tabIds,
  } = props;
  const sideBarWidth = useRef(
    new Animated.Value(TABBAR_COLAPSED_WIDTH),
  ).current;
  /**
   * 0 - colapsed
   * 1 - expanding
   * 2 - colapsing
   * 3 - expanded
   */
  const animationState = useObservable<0 | 1 | 2 | 3>(0);
  const listRef = useRef<LegendListRef>(null);

  const openAndFocusTab = useCallback(() => {
    onNewTabButtonPress?.();
    const id = selectedTabId.peek() + '';
    const index = tabIds.peek().findIndex(v => v === id);
    if (index !== -1) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: index,
          animated: true,
        });
      }, 10);
      return;
    }
    console.error('item not found');
  }, [onNewTabButtonPress, selectedTabId, tabIds]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      const { id, name } = tabs[item as unknown as number].get();
      return (
        <Tab
          onPress={() => selectTab?.(id)}
          onClose={() => closeTab?.(id)}
          selectedTabId={selectedTabId}
          id={id}
          name={name}
          _tab={tabs[item as unknown as number]}
        />
      );
    },
    [closeTab, selectTab, selectedTabId, tabs],
  );

  const expandAnimation = useMemo(
    () =>
      Animated.spring(sideBarWidth, {
        toValue: TABBAR_EXPANDED_WIDTH,
        speed: OPEN_ANIMATION_SPEED,
        bounciness: 0,
        useNativeDriver: false,
        isInteraction: true,
        delay: DELAY_TO_EXPAND,
      }),
    [sideBarWidth],
  );

  const expand = useCallback(() => {
    // Already expanding
    const state = animationState.peek();
    if (state === 1 || state === 3) {
      return;
    }
    // console.log('expand');
    // start animating
    animationState.set(1);
    expandAnimation.start(({ finished }) => {
      if (finished) {
        // Stop animating
        animationState.set(3);
      }
    });
  }, [animationState, expandAnimation]);

  const colapse = useCallback(() => {
    // Already colapsing
    if (animationState.peek() === 2) {
      return;
    }
    // console.log('colapse');
    // start animating
    animationState.set(2);
    Animated.spring(sideBarWidth, {
      toValue: TABBAR_COLAPSED_WIDTH,
      speed: CLOSE_ANIMATION_SPEED,
      bounciness: 0,
      useNativeDriver: false,
      isInteraction: true,
    }).start(ended => {
      if (ended.finished) {
        // Stop animating
        animationState.set(0);
      }
    });
  }, [animationState, sideBarWidth]);

  console.debug('render: ');
  return (
    <TabbarContainer
      // @ts-expect-error
      onMouseEnter={expand}
      onMouseLeave={colapse}
      style={[sideBar, { width: sideBarWidth }]}>
      {/* Blurred backgournd when opened */}
      <AbsolutePositioned
        style={[
          absolutePositioned,
          {
            opacity: sideBarWidth.interpolate(interpolationConfig),
          },
        ]}>
        <BlurGB />
      </AbsolutePositioned>

      {/* Tab list */}
      <Memo>
        <LegendList
          data={tabIds.get()}
          style={fatlist}
          ref={listRef}
          contentContainerStyle={fatlistContent}
          renderItem={renderItem}
          keyExtractor={item => item}
          // showsVerticalScrollIndicator={showScrollIndicator.get()}
          estimatedItemSize={36}
        />
      </Memo>

      <NewButtonContainer>
        <NewTabButton onPress={openAndFocusTab} />
      </NewButtonContainer>
    </TabbarContainer>
  );
}

// function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
//   let timeout: ReturnType<typeof setTimeout>;

//   return function(...args: Parameters<T>) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//   };
// }

const TabbarContainer = Animated.View;
const AbsolutePositioned = Animated.View;
const sideBar = {
  // backgroundColor: 'blue',
  borderRadius: WINDOW_BORDER_SIZE,
  zIndex: 3,
  height: '100%',
  // flex: 1,
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

const absolutePositioned = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
} as const;
const BlurGB = Styled.createStyled(BlurView, {
  flex: 1,
});

const NewButtonContainer = Styled.createStyledView({
  padding: WINDOW_BORDER_SIZE,
});
