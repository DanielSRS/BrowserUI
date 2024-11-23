import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/Tabbar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { Styled, useColors } from 'react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';

const TABS = [
  { id: 0, name: 'New Tab' },
  { id: 1, name: 'New Tab' },
  { id: 2, name: 'New Tab' },
  { id: 3, name: 'New Tab' },
  { id: 4, name: 'New Tab' },
  { id: 5, name: 'New Tab' },
  { id: 6, name: 'New Tab' },
  { id: 7, name: 'New Tab' },
  { id: 8, name: 'New Tab' },
  { id: 9, name: 'New Tab' },
  { id: 10, name: 'New Tab' },
  { id: 11, name: 'New Tab' },
  { id: 12, name: 'New Tab' },
  { id: 13, name: 'New Tab' },
  { id: 14, name: 'New Tab' },
  { id: 15, name: 'New Tab' },
  { id: 16, name: 'New Tab' },
  { id: 17, name: 'New Tab' },
  { id: 18, name: 'New Tab' },
  { id: 19, name: 'New Tab' },
  { id: 20, name: 'New Tab' },
  { id: 21, name: 'New Tab' },
  { id: 22, name: 'New Tab' },
  { id: 23, name: 'New Tab' },
  { id: 24, name: 'New Tab' },
  { id: 25, name: 'New Tab' },
  { id: 26, name: 'New Tab' },
  { id: 27, name: 'New Tab' },
  { id: 28, name: 'New Tab' },
  { id: 29, name: 'New Tab' },
  { id: 30, name: 'New Tab' },
] as const;

export function App() {
  const colors = useColors();
  return (
    <Window>
      {/* Nav bar */}
      <ExpandOnHover>
        <Topbar />
      </ExpandOnHover>
      <Row>
        {/* Tabbar */}
        <Tabbar tabList={TABS} />
        {/* Content container */}
        <ContentArea
          style={[{ borderColor: colors.strokeColorDividerStrokeDefault }]}>
          {/* Content */}
          <Content>
            {}
            {}
          </Content>
        </ContentArea>
      </Row>
    </Window>
  );
}

const SIDEBAR_SIZE = 36 + 2 * WINDOW_BORDER_SIZE;

const Window = memo(
  Styled.createStyledView(
    {
      flex: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      // borderWidth: 1,
      borderRadius: 10,
      zIndex: 3,
      overflow: 'hidden',
    },
    'Window',
  ),
);

const Row = memo(
  Styled.createStyledView(
    {
      flex: 1,
      flexDirection: 'row',
      // columnGap: WINDOW_BORDER_SIZE,
    },
    'Row',
  ),
);

const ContentArea = memo(
  Styled.createStyledView(
    {
      flex: 1,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: WINDOW_BORDER_SIZE,
      ...StyleSheet.absoluteFillObject,
      left: SIDEBAR_SIZE,
      right: WINDOW_BORDER_SIZE,
      bottom: WINDOW_BORDER_SIZE,
      top: WINDOW_BORDER_SIZE,
      // backgroundColor: 'green',
    },
    'ContentArea',
  ),
);

const Content = memo(
  Styled.createStyledView(
    {
      flex: 1,
      borderRadius: WINDOW_BORDER_SIZE,
    },
    'Content',
  ),
);
