import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/Tabbar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { Styled, useColors, ZStack } from 'react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';
import { NewTab } from './Pages/NewTab/NewTab';
import { observer } from '@legendapp/state/react';
import { workspace } from './store/store';
import { Config } from './Pages/Config/Config';
import { hideTitleBar, showTrafficLights } from 'react-native-infinity';

const isTopBarExpanded = true;
if (isTopBarExpanded) {
  showTrafficLights();
} else {
  hideTitleBar();
}
export const App = function App() {
  const colors = useColors();
  return (
    <Window>
      {/* Nav bar */}
      <ExpandOnHover expanded={isTopBarExpanded}>
        <Topbar />
      </ExpandOnHover>
      <Row>
        {/* Tabbar */}
        <Tabbar workspace={workspace} />
        {/* Content container */}
        <ContentArea
          style={[
            { borderColor: colors.strokeColorDividerStrokeDefault },
            !isTopBarExpanded && { top: WINDOW_BORDER_SIZE },
          ]}>
          {/* Content */}
          <Content />
        </ContentArea>
      </Row>
    </Window>
  );
};

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
      // top: WINDOW_BORDER_SIZE,
      // backgroundColor: 'green',
    },
    'ContentArea',
  ),
);

const ContentContainer = memo(
  Styled.createStyledView(
    {
      flex: 1,
      borderRadius: WINDOW_BORDER_SIZE,
    },
    'Content',
  ),
);

const Content = observer(() => {
  const selectedTab = workspace.selectedTabId.get();
  const tabList = workspace.tabs.get();
  const tabs = useMemo(
    () =>
      tabList.map(tab => {
        if (tab.id !== selectedTab) {
          return <React.Fragment key={tab.id} />;
        }
        if (tab.url === 'browser://config') {
          return <Config key={tab.id} />;
        }

        return <NewTab key={tab.id} />;
      }),
    [selectedTab, tabList],
  );

  return (
    <ContentContainer>
      <ZStack>{tabs}</ZStack>
    </ContentContainer>
  );
});
