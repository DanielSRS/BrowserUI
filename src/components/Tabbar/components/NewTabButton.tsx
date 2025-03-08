import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Styled, useColors } from 'react-native-sdk';
import { HoverView } from './HoverView';
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

  return (
    <View>
      {/* Tab background */}

      {/* Pressable area */}
      <TouchableContainer onPress={onPress}>
        {/* Hover bg */}
        <HoverView
          style={hoverStyle}
          hoveredStyle={{ backgroundColor: colors.fillColorControlDefault }}
        />

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
  pointerEvents: 'none',
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
  padding: ICON_PADDING - StyleSheet.hairlineWidth,
});

const IconGroup = Styled.createStyledView({
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});
