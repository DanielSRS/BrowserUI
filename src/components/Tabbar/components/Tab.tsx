import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption, Styled, useColors } from 'react-native-sdk';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import { DismissFilled, TabDesktopNewPageRegular } from './Icons';

interface TabProps {
  /**
   * Identificação unica da aba
   */
  id: number;
  /**
   * Callback chamado ao pressionar a aba
   */
  onPress?: (pressedTab: Pick<TabProps, 'id' | 'name'>) => void;
  /**
   * Indica se aba está selecionada
   */
  isSelected?: boolean;
  /**
   * Nome da aba
   */
  name: string;
}
export const Tab = React.memo((props: TabProps) => {
  const { id, onPress, isSelected, name } = props;
  const [isHovered, setIsHovered] = useState(false);
  const colors = useColors();

  const hoverBgColor = { backgroundColor: colors.fillColorControlDefault };

  const fireTabPressEvent = () => {
    onPress?.({
      id,
      name,
    });
  };

  return (
    <View key={id}>
      {/* Pressable area */}
      <TouchableOpacity
        onPress={fireTabPressEvent}
        // @ts-expect-error
        onMouseEnter={(_p: MouseEvent) => {
          setIsHovered(true);
        }}
        onMouseLeave={(_p: MouseEvent) => {
          setIsHovered(false);
        }}
        style={[
          btn,
          isHovered && hoverBgColor,
          isSelected && {
            borderColor: colors.controlStrongStrokeDefault,
          },
        ]}>
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
          {name}
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
        <DismissFilled color={colors.fillColorTextSecondary} />
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
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'transparent',
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
