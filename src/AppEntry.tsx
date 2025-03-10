import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/tab-bar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { Styled, useColors, ZStack } from 'react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';
import { NewTab } from './Pages/NewTab/NewTab';
import { Memo } from '@legendapp/state/react';
import { workspace, type Workspace } from './store/store';
import { Config } from './Pages/Config/Config';
import type { Observable } from '@legendapp/state';

const isTopBarExpanded = true;

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
        <Tabbar
          selectedTabId={workspace.selectedTabId}
          tabs={workspace.tabs}
          tabIds={workspace.tabIds}
          closeTab={workspace.closeTab}
          onNewTabButtonPress={workspace.openNewTab}
          selectTab={workspace.selectTab}
        />
        {/* Content container */}
        <ContentArea
          style={[
            { borderColor: colors.strokeColorDividerStrokeDefault },
            !isTopBarExpanded && { top: WINDOW_BORDER_SIZE },
          ]}>
          {/* Content */}
          <Content workspace$={workspace} />
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

interface ContentProps {
  workspace$: Observable<Workspace>;
}

function Content(props: ContentProps) {
  const { workspace$ } = props;
  return (
    <ContentContainer>
      <Memo>
        {() => (
          <ZStack>
            {workspace.tabIds.get().map(tab => {
              const { url, id } =
                workspace$.tabs[tab as unknown as number].get();
              if (url === 'browser://config') {
                return (
                  <Config
                    key={id}
                    selectedTab={workspace$.selectedTabId}
                    tabId={id}
                  />
                );
              }

              return (
                <NewTab
                  key={id}
                  selectedTab={workspace$.selectedTabId}
                  tabId={id}
                />
              );
            })}
          </ZStack>
        )}
      </Memo>
    </ContentContainer>
  );
}
