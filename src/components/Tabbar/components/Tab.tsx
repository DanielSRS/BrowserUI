import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption, Styled, useColors } from 'react-native-sdk';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import { DismissFilled, TabDesktopNewPageRegular } from './Icons';
import { HoverView } from './HoverView';
import { observer, useObservable } from '@legendapp/state/react';
import type { ObservableBoolean } from '@legendapp/state';

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
export const Tab = observer(function Tab(props: TabProps) {
  const { id, onPress, isSelected, name } = props;
  const isHovered$ = useObservable(false);
  const colors = useColors();

  const hoverBgColor = useMemo(
    () => ({
      backgroundColor: colors.fillColorControlDefault,
      borderRadius: WINDOW_BORDER_SIZE * 0.9,
    }),
    [colors.fillColorControlDefault],
  );

  const fireTabPressEvent = useCallback(() => {
    onPress?.({
      id,
      name,
    });
  }, [id, name, onPress]);

  const setHovered = () => {
    // console.log('tab hover');
    isHovered$.set(true);
  };
  const unsetHovered = () => {
    // console.log('tab unhover');
    isHovered$.set(false);
  };

  return (
    <TabContent
      key={id}
      onPress={fireTabPressEvent}
      // @ts-expect-error
      onMouseEnter={setHovered}
      onMouseLeave={unsetHovered}
      style={[
        isSelected && {
          borderColor: colors.controlStrongStrokeDefault,
        },
      ]}>
      {/* Hover bg */}
      <HoverView show={isHovered$} style={hoverBgColor} />

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
      <CloseButton isTabHovered={isHovered$} />
    </TabContent>
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

const CloseButton = memo(
  observer(function CloseButton(props: { isTabHovered: ObservableBoolean }) {
    const { isTabHovered } = props;
    const [isHovered, setIsHovered] = useState<true>();
    const colors = useColors();

    if (!isTabHovered.get()) {
      return null;
    }

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
  }),
);

const TabName = memo(
  Styled.createStyled(
    Caption,
    {
      flex: 1,
    },
    'TabName',
  ),
);

const TabContent = Styled.createStyledTouchableOpacity(
  {
    borderRadius: WINDOW_BORDER_SIZE * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: ICON_PADDING,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  'TabContent',
);

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
