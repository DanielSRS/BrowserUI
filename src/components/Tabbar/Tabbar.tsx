import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

const WINDOW_BORDER_SIZE = 6;
/**
 * When titlebar is hidden, its size seem to still be accoutable and
 * all flatlist seems to inherit some sort of padding
 */
const TITLEBAR_SIZE = 21;

const TABS = [{ id: 13 }, { id: 14 }] as const;

interface TabbarProps {
  //
}
export function Tabbar(props: TabbarProps) {
  const {} = props;

  return (
    <View style={sideBar}>
      <FlatList
        data={TABS}
        style={fatlist}
        contentContainerStyle={fatlistContent}
        renderItem={({ item }) => <Tab {...item} />}
      />
    </View>
  );
}

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
  // maxWidth: 50,
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

interface TabProps {
  id: number;
}
const Tab = (props: TabProps) => {
  const { id } = props;
  const hoverRef = useRef<HoverViewRef>(null);

  return (
    <View key={id}>
      <HoverView ref={hoverRef} style={{ borderRadius: btn.borderRadius }} />
      <TouchableOpacity
        onPressIn={() => {
          hoverRef.current?.setOpacity(0.4);
        }}
        onPressOut={() => {
          hoverRef.current?.setOpacity(1);
        }}
        style={btn}>
        <View style={btnIconContainer}>
          <View style={icon} />
        </View>
        <Text
          numberOfLines={1} // otherwise, tab height changes when theres no enough space
        >
          TAB NAME
        </Text>
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
