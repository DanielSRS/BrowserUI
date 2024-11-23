import React, { memo, useCallback, useMemo, useState } from 'react';
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
export const Tab = React.memo(function Tab(props: TabProps) {
  const { id, onPress, isSelected, name } = props;
  const [isHovered, setIsHovered] = useState(false);
  const colors = useColors();

  const hoverBgColor = useMemo(
    () => ({ backgroundColor: colors.fillColorControlDefault }),
    [colors.fillColorControlDefault],
  );

  const fireTabPressEvent = useCallback(() => {
    onPress?.({
      id,
      name,
    });
  }, [id, name, onPress]);

  const setHovered = useCallback(() => setIsHovered(true), []);
  const unsetHovered = useCallback(() => setIsHovered(false), []);

  return (
    <View key={id}>
      {/* Pressable area */}
      <TouchableOpacity
        onPress={fireTabPressEvent}
        // @ts-expect-error
        onMouseEnter={setHovered}
        onMouseLeave={unsetHovered}
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

const CloseButtonContainer = memo(
  Styled.createStyledView(
    {
      borderRadius: 3,
      padding: 1,
    },
    'CloseButtonContainer',
  ),
);

const CloseButton = memo(() => {
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
});

const TabName = memo(
  Styled.createStyled(
    Caption,
    {
      flex: 1,
    },
    'TabName',
  ),
);

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
  paddingHorizontal: ICON_PADDING,
  paddingVertical: ICON_PADDING - StyleSheet.hairlineWidth * 2,
} as const;

const icon = {
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
} as const;

// const hoverBgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };
