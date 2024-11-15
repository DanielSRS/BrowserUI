import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Caption, useColors } from 'react-native-sdk';
import { HoverView, type HoverViewRef } from './HoverView';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import { TabDesktopNewPageRegular } from './Icons';

interface TabProps {
  id: number;
  onPress?: () => void;
}
export const Tab = React.memo((props: TabProps) => {
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
          <View style={[icon]}>
            <TabDesktopNewPageRegular color={colors.fillColorTextSecondary} />
          </View>
        </View>
        <Caption
          numberOfLines={1} // otherwise, tab height changes when theres no enough space
        >
          TAB NAME
        </Caption>
      </TouchableOpacity>
    </View>
  );
});

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

const icon = {
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
} as const;
