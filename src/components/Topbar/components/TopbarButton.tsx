import React from 'react';
import { Styled, useColors } from '@danielsrs/react-native-sdk';
import { BUTTON_ICON_SIZE } from '../../Tabbar/Tabbar.contants';
import type { ColorValue } from 'react-native';
import { HoverView } from '../../Tabbar/components/HoverView';

interface TabProps {
  // id: number;
  // onPress?: () => void;
  /**
   * ButttonIcon
   */
  children: (props: { color: ColorValue }) => React.ReactNode;
}
export const TopBarButton = React.memo(function TopBarButton(props: TabProps) {
  const { children: Icon } = props;
  const colors = useColors();

  return (
    // Pressable area
    <ButtonContainer>
      {/* Tab icon */}
      <HoverView
        hoveredStyle={{ backgroundColor: colors.fillColorControlDefault }}
      />
      <IconGroup>
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
