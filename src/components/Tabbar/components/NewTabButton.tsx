import React, { useRef } from 'react';
import { View } from 'react-native';
import { Caption, Styled, useColors } from 'react-native-sdk';
import { HoverView, type HoverViewRef } from './HoverView';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import { AddRegular } from './Icons';

interface NewTabButtonProps {
  // id: number;
  onPress?: () => void;
}
export const NewTabButton = React.memo((props: NewTabButtonProps) => {
  const { onPress } = props;
  const colors = useColors();
  const hoverRef = useRef<HoverViewRef>(null);

  return (
    <View>
      {/* Tab background */}
      <HoverView
        ref={hoverRef}
        style={hoverStyle}
        hoveredStyle={{ backgroundColor: colors.fillColorControlDefault }}
      />

      {/* Pressable area */}
      <TouchableContainer
        onPress={onPress}
        onPressIn={() => {
          hoverRef.current?.setOpacity(0.4);
        }}
        onPressOut={() => {
          hoverRef.current?.setOpacity(1);
        }}>
        {/* Tab icon */}
        <IconContainer>
          <IconGroup>
            <AddRegular color={colors.fillColorTextSecondary} />
          </IconGroup>
        </IconContainer>

        {/* Tab name */}
        <ButtonTitle
          // otherwise, tab height changes when theres no enough space
          numberOfLines={1}>
          New Tab
        </ButtonTitle>

        {/* Shortcut */}
      </TouchableContainer>
    </View>
  );
});

const ButtonTitle = Styled.createStyled(Caption, {
  flex: 1,
});

const TouchableContainer = Styled.createStyledTouchableOpacity({
  borderRadius: WINDOW_BORDER_SIZE * 0.9,
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  paddingRight: ICON_PADDING,
});

const hoverStyle = {
  borderRadius: WINDOW_BORDER_SIZE * 0.9,
} as const;

const IconContainer = Styled.createStyledView({
  padding: ICON_PADDING,
});

const IconGroup = Styled.createStyledView({
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});
