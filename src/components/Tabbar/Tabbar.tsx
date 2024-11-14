import { BlurView } from 'blurview';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Caption, useColors } from 'react-native-sdk';

const WINDOW_BORDER_SIZE = 6;
/**
 * When titlebar is hidden, its size seem to still be accoutable and
 * all flatlist seems to inherit some sort of padding
 */
const TITLEBAR_SIZE = 21;

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

const BUTTON_ICON_SIZE = 16;
const BUTTUN_SIZE = 36;
const ICON_PADDING = (BUTTUN_SIZE - BUTTON_ICON_SIZE) / 2;
const btn = {
  borderRadius: WINDOW_BORDER_SIZE * 0.9,
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  paddingRight: ICON_PADDING,
} as const;
const btnIconContainer = {
  padding: ICON_PADDING,
} as const;

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

const icon = {
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  borderWidth: 1,
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

interface TabProps {
  id: number;
  onPress?: () => void;
}
const Tab = (props: TabProps) => {
  const { id, onPress } = props;
  const colors = useColors();
  const hoverRef = useRef<HoverViewRef>(null);

  return (
    <View key={id}>
      <HoverView
        ref={hoverRef}
        style={{ borderRadius: btn.borderRadius }}
        hoveredStyle={{ backgroundColor: colors.fillColorControlDefault }}
      />
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          hoverRef.current?.setOpacity(0.4);
        }}
        onPressOut={() => {
          hoverRef.current?.setOpacity(1);
        }}
        style={btn}>
        <View style={btnIconContainer}>
          <View
            style={[
              icon,
              { borderColor: colors.strokeColorControlStrongStrokeDefault },
            ]}
          />
        </View>
        <Caption
          numberOfLines={1} // otherwise, tab height changes when theres no enough space
        >
          TAB NAME
        </Caption>
      </TouchableOpacity>
    </View>
  );
};

interface HoverViewProps {
  hoveredStyle?: ViewStyle;
  style?: ViewStyle;
}
interface HoverViewRef {
  setOpacity: (value: number) => void;
}
const HoverView = forwardRef<HoverViewRef, HoverViewProps>((props, ref) => {
  const { hoveredStyle, style } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [opacity, setOpaciy] = useState(1);
  const bgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };

  useImperativeHandle(ref, () => ({
    setOpacity: setOpaciy,
  }));

  return (
    <View
      // @ts-expect-error
      onMouseEnter={(_p: MouseEvent) => {
        setIsHovered(true);
      }}
      onMouseLeave={(_p: MouseEvent) => {
        setIsHovered(false);
      }}
      style={[
        StyleSheet.absoluteFill,
        style,
        { opacity },
        isHovered ? bgColor : undefined,
        isHovered ? hoveredStyle : undefined,
      ]}
    />
  );
});
