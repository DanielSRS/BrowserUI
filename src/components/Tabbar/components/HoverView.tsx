import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface HoverViewProps {
  hoveredStyle?: ViewStyle;
  style?: ViewStyle;
}
export interface HoverViewRef {
  setOpacity: (value: number) => void;
}
export const HoverView = forwardRef<HoverViewRef, HoverViewProps>(
  (props, ref) => {
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
  },
);
