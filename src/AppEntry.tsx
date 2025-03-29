import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/tab-bar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { Styled, useColors, ZStack } from '@danielsrs/react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';
import { NewTab } from './Pages/NewTab/NewTab';
import { Memo, use$ } from '@legendapp/state/react';
import { settings, workspace, type Workspace } from './store/store';
import { Config } from './Pages/Config/Config';
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
        {() => {
          const tabs = workspace.tabIds.get();
          return (
            <ZStack>
              {tabs.map(tab => (
                <Memo key={tab}>
                  {() => {
                    const tabId = tab as unknown as number;
                    const { url, id } = workspace$.tabs[tabId].get();

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
                  }}
                </Memo>
              ))}
            </ZStack>
          );
        }}
      </Memo>
    </ContentContainer>
  );
}
