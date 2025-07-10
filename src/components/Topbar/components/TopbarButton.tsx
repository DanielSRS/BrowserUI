import React from 'react';
import { Styled, useColors } from '@danielsrs/react-native-sdk';
import { BUTTON_ICON_SIZE } from '../../Tabbar/Tabbar.contants';
import { HoverView } from '../../Tabbar/components/HoverView';
import type { ColorValue, TouchableOpacityProps } from 'react-native';

interface TabProps extends Omit<TouchableOpacityProps, 'children'> {
  // id: number;
  // onPress?: () => void;
  /**
   * ButttonIcon
   */
  children: (props: { color: ColorValue }) => React.ReactNode;
}
export const TopBarButton = React.memo(function TopBarButton(props: TabProps) {
  const { children: Icon, ...rest } = props;
  const colors = useColors();
  const opacity = props.disabled ? 0.5 : 1;
  const backgroundColor = props.disabled
    ? undefined
    : colors.fillColorControlDefault;

  return (
    // Pressable area
    <ButtonContainer {...rest}>
      {/* Tab icon */}
      <HoverView hoveredStyle={{ backgroundColor }} />
      <IconGroup style={{ opacity }}>
        <Icon color={colors.fillColorTextPrimary} />
      </IconGroup>
    </ButtonContainer>
  );
});

const IconGroup = Styled.createStyledView({
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  // borderWidth: 1,
});

const ButtonContainer = Styled.createStyledTouchableOpacity({
  // borderRadius: WINDOW_BORDER_SIZE * 0.9,
  // flexDirection: 'row',
  // alignItems: 'center',
  // overflow: 'hidden',
  // paddingRight: ICON_PADDING,

  // borderWidth: 1,
  aspectRatio: 4 / 3,
  height: 30,
  borderRadius: 4,
  // backgroundColor: 'rgba(0, 0, 0, 0.04)',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});
// const hoverBgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };
