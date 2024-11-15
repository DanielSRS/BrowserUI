import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Caption, Styled, useColors } from 'react-native-sdk';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import { DismissFilled, TabDesktopNewPageRegular } from './Icons';

interface TabProps {
  id: number;
  onPress?: () => void;
}
export const Tab = React.memo((props: TabProps) => {
  const { id, onPress } = props;
  const [isHovered, setIsHovered] = useState(false);
  const colors = useColors();

  const hoverBgColor = { backgroundColor: colors.fillColorControlDefault };

  return (
    <View key={id}>
      {/* Pressable area */}
      <TouchableOpacity
        onPress={onPress}
        // @ts-expect-error
        onMouseEnter={(_p: MouseEvent) => {
          setIsHovered(true);
        }}
        onMouseLeave={(_p: MouseEvent) => {
          setIsHovered(false);
        }}
        style={[btn, isHovered && hoverBgColor]}>
        {/* Tab icon */}
        <View style={btnIconContainer}>
          <View style={[icon]}>
            <TabDesktopNewPageRegular color={colors.fillColorTextSecondary} />
          </View>
        </View>

        {/* Tab name */}
        <TabName
          // otherwise, tab height changes when theres no enough space
          numberOfLines={1}>
          TAB NAME
        </TabName>

        {/* Close button */}
        {isHovered && <CloseButton />}
      </TouchableOpacity>
    </View>
  );
});

const CloseButtonContainer = Styled.createStyledView({
  borderRadius: 3,
  padding: 1,
});
const CloseButton = () => {
  const [isHovered, setIsHovered] = useState<true>();
  const colors = useColors();

  const hoverStyle = isHovered && {
    backgroundColor: colors.controlAltQuarternary,
  };

  return (
    <CloseButtonContainer
      // @ts-expect-error
      onMouseEnter={(_p: MouseEvent) => {
        setIsHovered(true);
      }}
      onMouseLeave={(_p: MouseEvent) => {
        setIsHovered(undefined);
      }}
      style={hoverStyle}>
      {/* Close icon */}
      <TouchableOpacity>
        <DismissFilled />
      </TouchableOpacity>
    </CloseButtonContainer>
  );
};

const TabName = Styled.createStyled(Caption, {
  flex: 1,
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

// const hoverBgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };
