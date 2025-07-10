import { ObservableHint, type Observable } from '@legendapp/state';
import type { Workspace } from '../../store/store';
import { use$ } from '@legendapp/state/react';
import { Config } from '../../Pages/Config/Config';
import { Showcase } from '../../Pages/showcase/showcase';
import { NewTab } from '../../Pages/NewTab/NewTab';
import { Styled } from '@danielsrs/react-native-sdk';
import { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Image } from 'react-native';
import { sendRNEvent } from '../../webview-injected-scripts/send-event';
import { listenForNavigationChanges } from '../../webview-injected-scripts/navigation-events';
import type { WVNavigationEvent } from '../../webview-injected-scripts/types';

interface TabRendererProps {
  tabId: number;
  workspace$: Observable<Workspace>;
}

export function TabRenderer(props: TabRendererProps) {
  const { tabId, workspace$ } = props;
  const tabData = workspace$.tabs[tabId];
  const _url = use$(tabData.state.url);
  const webviewRef = useRef<WebView>(null);

  // Set favicon for the tab
  useEffect(() => {
    const isInternalPage = _url.startsWith('browser://');
    if (isInternalPage) {
      return;
    }
    const ur = _url.indexOf('://');
    if (ur === -1) {
      console.warn('Invalid URL ÇÇÇ:', _url);
      return;
    }
    let l = _url.substring(ur + 3).indexOf('/');
    if (l === -1) {
      console.log('shorrt???', _url.substring(0, ur));
      l = 0;
      return;
    }
    const faviconUrl = _url.substring(0, ur + l + 1 + 3) + 'favicon.ico';
    console.log('Favicon URL:', faviconUrl);
    fetch(faviconUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // console.log(reader.result.toString());
          const comp = () => (
            <Image
              key={faviconUrl}
              style={{ width: 16, height: 16 }}
              source={{ uri: reader.result.toString() }}
            />
          );
          tabData.icon.set(
            ObservableHint.opaque({
              component: comp,
            }),
          );
        };
        reader.readAsDataURL(blob);
      });
  }, [_url, tabData.icon]);

  useEffect(() => {
    tabData.actions.set({
      goBack: () => {
        webviewRef.current?.goBack();
      },
      goForward: () => {
        webviewRef.current?.goForward();
      },
      reload: () => {
        webviewRef.current?.reload();
      },
    });
  }, [tabData, webviewRef]);

  useEffect(() => {
    // Set zoom level for the page
    setTimeout(() => {
      // webviewRef.current?.injectJavaScript(
      //   'document.body.style.zoom = "0.9";globalThis.sendRNEvent("bodyZoomChanged", { newZoom: document.body.style.zoom });',
      // );
    }, 5000);
  }, [_url, webviewRef]);

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
      injectedJavaScriptBeforeContentLoaded={
        sendRNEvent + listenForNavigationChanges
      }
      onNavigationStateChange={state => {
        tabData.state.set(state);
      }}
      onMessage={event => {
        const data = JSON.parse(event.nativeEvent.data) as WVNavigationEvent;
        switch (data.type) {
          case 'navigation':
            // tabData.state.url.set(data.payload.url);
            tabData.state.title.set(data.payload.title);
            break;
          default:
            console.warn('Unknown event type:', data.type);
        }
        console.log('WebView message:', event.nativeEvent.data);
      }}
      userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15"
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
