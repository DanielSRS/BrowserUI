import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption, Styled, useColors } from '@danielsrs/react-native-sdk';
import {
  BUTTON_ICON_SIZE,
  ICON_PADDING,
  WINDOW_BORDER_SIZE,
} from '../Tabbar.contants';
import {
  Dismiss16Regular,
  TabDesktopNewPage20Regular,
} from '../../fluent-icons/fluent-icons';
import { HoverView } from './HoverView';
import { Computed, Memo, useObservable } from '@legendapp/state/react';
import type { ObservableBoolean, ObservablePrimitive } from '@legendapp/state';

interface TabProps {
  /**
   * Identificação unica da aba
   */
  id: number;
  /**
   * Callback chamado ao pressionar a aba
   */
  onPress?: (pressedTab: Pick<TabProps, 'id' | 'name'>) => void;
  onClose?: (pressedTab: Pick<TabProps, 'id' | 'name'>) => void;
  /**
   * Nome da aba
   */
  name: string;
  selectedTabId: ObservablePrimitive<number>;
}
export function Tab(props: TabProps) {
  const { id, onPress, name, onClose, selectedTabId } = props;
  const isHovered$ = useObservable(false);
  const isSelected$ = useObservable(() => selectedTabId.get() === id);
  const colors = useColors();

  const hoverBgColor = useMemo(
    () => ({
      backgroundColor: colors.fillColorSubtleSecondary,
      borderRadius: WINDOW_BORDER_SIZE * 0.9,
    }),
    [colors.fillColorSubtleSecondary],
  );

  const fireTabPressEvent = useCallback(() => {
    onPress?.({
      id,
      name,
    });
  }, [id, name, onPress]);

  const fireTabCloseEvent = useCallback(() => {
    onClose?.({
      id,
      name,
    });
  }, [id, name, onClose]);

  const setHovered = () => {
    // console.log('tab hover');
    isHovered$.set(true);
  };
  const unsetHovered = () => {
    // console.log('tab unhover');
    isHovered$.set(false);
  };

  return (
    <Computed>
      <TabContent
        onPress={fireTabPressEvent}
        // @ts-expect-error
        onMouseEnter={setHovered}
        onMouseLeave={unsetHovered}
        style={[
          isSelected$.get() && {
            borderColor: colors.controlStrongStrokeDefault,
          },
        ]}>
        {/* Hover bg */}
        <HoverView show={isHovered$} style={hoverBgColor} />

        {/* Tab icon */}
        <View style={btnIconContainer}>
          <View style={[icon]}>
            <TabDesktopNewPage20Regular color={colors.fillColorTextSecondary} />
          </View>
        </View>

        {/* Tab name */}
        <TabName
          // otherwise, tab height changes when theres no enough space
          numberOfLines={1}>
          {name}
        </TabName>

        {/* Close button */}
        <CloseButton isTabHovered={isHovered$} onPress={fireTabCloseEvent} />
      </TabContent>
    </Computed>
  );
}

const CloseButtonContainer = memo(
  Styled.createStyledView(
    {
      borderRadius: 3,
      padding: 1,
    },
    'CloseButtonContainer',
  ),
);

const CloseButton = memo(function CloseButton(props: {
  isTabHovered: ObservableBoolean;
  onPress: () => void;
}) {
  const { isTabHovered, onPress } = props;
  const [isHovered, setIsHovered] = useState<true>();
  const colors = useColors();

  const hoverStyle = isHovered && {
    backgroundColor: colors.controlAltQuarternary,
  };

  return (
    <Memo>
      {isTabHovered.get() ? (
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
          <TouchableOpacity onPress={onPress}>
            <Dismiss16Regular
              width={16}
              height={16}
              color={colors.fillColorTextSecondary}
            />
          </TouchableOpacity>
        </CloseButtonContainer>
      ) : null}
    </Memo>
  );
});

const TabName = memo(
  Styled.createStyled(
    Caption,
    {
      flex: 1,
      pointerEvents: 'none',
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
  paddingHorizontal: ICON_PADDING - StyleSheet.hairlineWidth,
  paddingVertical: ICON_PADDING - StyleSheet.hairlineWidth,
  pointerEvents: 'none',
} as const;

const icon = {
  width: BUTTON_ICON_SIZE,
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  // backgroundColor: 'red',
} as const;

// const hoverBgColor = { backgroundColor: 'rgba(255, 255, 255, 0.08)' };
