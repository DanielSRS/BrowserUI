import React, { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
import type { Observable, ObservableBoolean } from '@legendapp/state';
import type { Tab } from '../../../store/store';

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
  selectedTabId: number;
  icon?: () => React.ReactNode;
  _tab?: Observable<Tab>;
}
export function Tab(props: TabProps) {
  const { id, onPress, name, onClose, selectedTabId, _tab } = props;
  const isHovered$ = useObservable(false);
  const isSelected = selectedTabId === id;
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
      <Pressable
        onPress={fireTabPressEvent}
        onHoverIn={setHovered}
        onHoverOut={unsetHovered}
        style={[
          tabContentStyle,
          isSelected && {
            borderColor: colors.controlStrongStrokeDefault,
          },
        ]}>
        {/* Hover bg */}
        <HoverView show={isHovered$} style={hoverBgColor} />

        {/* Tab icon */}
        <View style={btnIconContainer}>
          <View style={[icon]}>
            <Computed>
              {() => {
                const Icon = _tab?.icon.get(true)?.component;
                if (Icon) {
                  return <Icon />;
                }
                return (
                  <TabDesktopNewPage20Regular
                    color={colors.fillColorTextSecondary}
                  />
                );
              }}
            </Computed>
          </View>
        </View>

        {/* Tab name */}
        <TabName
          // otherwise, tab height changes when theres no enough space
          numberOfLines={1}>
          <Memo>{_tab?.state.title.get() ?? name}</Memo>
        </TabName>

        {/* Close button */}
        <CloseButton isTabHovered={isHovered$} onPress={fireTabCloseEvent} />
      </Pressable>
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
    <Computed>
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
          <Pressable onPress={onPress}>
            <Dismiss16Regular
              width={16}
              height={16}
              color={colors.fillColorTextSecondary}
            />
          </Pressable>
        </CloseButtonContainer>
      ) : null}
    </Computed>
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

const tabContentStyle = {
  borderRadius: WINDOW_BORDER_SIZE * 0.9,
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  paddingRight: ICON_PADDING,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'transparent',
} as const;

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
