import type { ObservableBoolean } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import React, { useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface HoverViewProps {
  hoveredStyle?: ViewStyle;
  style?: ViewStyle;
  show?: ObservableBoolean;
}
export const HoverView = observer(function HoverView(props: HoverViewProps) {
  const { hoveredStyle, style, show } = props;
  const [isHovered, setIsHovered] = useState(false);

  if (show !== undefined && !show.get()) {
    return null;
  }

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
        isHovered ? bgColor : undefined,
        style,
        isHovered ? hoveredStyle : undefined,
      ]}
    />
  );
});

const bgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };
