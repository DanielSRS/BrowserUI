import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/tab-bar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { Styled, useColors } from '@danielsrs/react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';
import { Memo, use$ } from '@legendapp/state/react';
import { settings, workspace, type Workspace } from './store/store';
import { Screen, ScreenContainer } from 'react-native-screens';
import { TabRenderer } from './components/tab-renderer/tab-renderer';
import type { Observable } from '@legendapp/state';

export const App = function App() {
  return (
    <Window>
      {/* Nav bar */}
      <Memo>
        <ExpandOnHover expanded={settings.isTopBarExpanded.get()}>
          <Topbar />
        </ExpandOnHover>
      </Memo>
      <Row>
        {/* Tabbar */}
        <Tabbar
          selectedTabId={workspace.selectedTabId}
          tabs={workspace.tabs}
          tabIds={workspace.tabIds}
          closeTab={workspace.closeTab}
          onNewTabButtonPress={workspace.openNewTab}
          selectTab={workspace.selectTab}
        />
        {/* Content container */}
        <ContentArea />
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

const ContentAreaContainer = Styled.createStyledView({
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
});

function ContentArea() {
  const colors = useColors();
  const isTopBarExpanded = use$(settings.isTopBarExpanded);
  const borderColor = colors.strokeColorDividerStrokeDefault;
  return (
    <ContentAreaContainer
      style={[
        {
          borderColor,
        },
        !isTopBarExpanded && { top: WINDOW_BORDER_SIZE },
      ]}>
      {/* Content */}
      <Content workspace$={workspace} />
    </ContentAreaContainer>
  );
}

interface ContentProps {
  workspace$: Observable<Workspace>;
}

function Content(props: ContentProps) {
  const { workspace$ } = props;
  return (
    <ScreenContainer style={screenContainerStyles}>
      <Memo>
        {() => {
          const tabs = workspace$.tabIds.get();
          return tabs.map(tabId => {
            const activityState =
              workspace$.selectedTabId.get() === +tabId ? 2 : 0;
            return (
              <Screen activityState={activityState} key={tabId} style={FLEX1}>
                <TabRenderer tabId={+tabId} workspace$={workspace$} />
              </Screen>
            );
          });
        }}
      </Memo>
    </ScreenContainer>
  );
}
const screenContainerStyles = {
  flex: 1,
  borderRadius: WINDOW_BORDER_SIZE,
  overflow: 'hidden',
} as const;

const FLEX1 = {
  flex: 1,
} as const;
