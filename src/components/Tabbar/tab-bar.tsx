import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, FlatList } from 'react-native';
import {
  TABBAR_COLAPSED_WIDTH,
  TABLIST_GAP,
  WINDOW_BORDER_SIZE,
} from './Tabbar.contants';
import { Memo, useObservable } from '@legendapp/state/react';
import { Styled } from 'react-native-sdk';
import { BlurView } from 'blurview';
import { NewTabButton } from './components/NewTabButton';
import { Tab } from './components/Tab';
import type { ObservablePrimitive } from '@legendapp/state';
import type { Tab as TAB } from '../../store/store';

const TABBAR_EXPANDED_WIDTH = 250;
const OPEN_ANIMATION_DURATION = 30;
const CLOSE_ANIMATION_DURATION = 50;
const DELAY_TO_EXPAND = 40;

interface TabbarProps {
  onNewTabButtonPress?: () => void;
  tabs: {
    get: () => TAB[];
  };
  selectTab?: (id: number) => void;
  closeTab?: (id: number) => void;
  selectedTabId: ObservablePrimitive<number>;
}
export function Tabbar(props: TabbarProps) {
  const { tabs, onNewTabButtonPress } = props;
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
  const showBlurview = useObservable(() => {
    return animationState.get() !== 0;
  });

  const expandAnimation = useMemo(
    () =>
      Animated.timing(sideBarWidth, {
        toValue: TABBAR_EXPANDED_WIDTH,
        duration: OPEN_ANIMATION_DURATION,
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
    console.log('expand');
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
    console.log('colapse');
    // start animating
    animationState.set(2);
    Animated.timing(sideBarWidth, {
      toValue: TABBAR_COLAPSED_WIDTH,
      duration: CLOSE_ANIMATION_DURATION,
      useNativeDriver: false,
      isInteraction: true,
    }).start(ended => {
      if (ended.finished) {
        // Stop animating
        animationState.set(0);
      }
    });
  }, [animationState, sideBarWidth]);

  console.debug('render');
  return (
    <TabbarContainer
      // @ts-expect-error
      onMouseEnter={expand}
      onMouseLeave={colapse}
      style={[sideBar, { width: sideBarWidth }]}>
      {/* Blurred backgournd when opened */}
      <Memo>
        {() =>
          showBlurview.get() && (
            <AbsolutePositioned>
              <BlurGB />
            </AbsolutePositioned>
          )
        }
      </Memo>

      {/* Tab list */}
      <Memo>
        {() => (
          <FlatList
            data={tabs.get()}
            style={fatlist}
            contentContainerStyle={fatlistContent}
            renderItem={renderItem(props)}
            showsVerticalScrollIndicator={animationState.get() === 3}
            // extraData={workspace.tabs.length}
          />
        )}
      </Memo>

      <NewButtonContainer>
        <NewTabButton onPress={onNewTabButtonPress} />
      </NewButtonContainer>
    </TabbarContainer>
  );
}

const renderItem =
  (workspace: {
    selectTab?: (id: number) => void;
    closeTab?: (id: number) => void;
    selectedTabId: ObservablePrimitive<number>;
  }) =>
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

// function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
//   let timeout: ReturnType<typeof setTimeout>;

//   return function(...args: Parameters<T>) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//   };
// }

const TabbarContainer = Animated.View;
const sideBar = {
  // backgroundColor: 'blue',
  borderRadius: WINDOW_BORDER_SIZE,
  zIndex: 3,
  // height: '100%',
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

const AbsolutePositioned = Styled.createStyledView({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
});
const BlurGB = Styled.createStyled(BlurView, {
  flex: 1,
});

const NewButtonContainer = Styled.createStyledView({
  padding: WINDOW_BORDER_SIZE,
});
