import type { Observable } from '@legendapp/state';
import type { Workspace } from '../../store/store';
import { use$ } from '@legendapp/state/react';
import { Config } from '../../Pages/Config/Config';
import { Showcase } from '../../Pages/showcase/showcase';
import { NewTab } from '../../Pages/NewTab/NewTab';
import { Styled } from '@danielsrs/react-native-sdk';
import { useRef } from 'react';
import { WebView } from 'react-native-webview';

interface TabRendererProps {
  tabId: number;
  workspace$: Observable<Workspace>;
}

export function TabRenderer(props: TabRendererProps) {
  const { tabId, workspace$ } = props;
  const tabData = workspace$.tabs[tabId];
  const _url = use$(tabData.state.url);
  const webviewRef = useRef<WebView>(null);

  if (!tabData || !_url) {
    return <NoTabData />;
  }

  const isInternalPage = _url.startsWith('browser://');
  if (isInternalPage) {
    const url = _url;
    if (url === 'browser://config') {
      return <Config key={tabData.id.peek()} />;
    }

    if (url === 'browser://showcase') {
      return <Showcase />;
    }

    if (url === 'browser://newTab') {
      return <NewTab />;
    }

    return <UnknownInternalTab />;
  }

  return (
    <WebView
      ref={webviewRef}
      key={tabData.id.peek()}
      source={{ uri: _url }}
      onNavigationStateChange={state => {
        tabData.state.set(state);
      }}
    />
  );
}

const NoTabData = Styled.createStyledView({
  backgroundColor: 'red',
  flex: 1,
});

const UnknownInternalTab = Styled.createStyledView({
  backgroundColor: 'yellow',
  flex: 1,
});
