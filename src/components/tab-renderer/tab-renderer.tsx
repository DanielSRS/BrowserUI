import type { Observable } from '@legendapp/state';
import type { Workspace } from '../../store/store';
import { use$ } from '@legendapp/state/react';
import { Config } from '../../Pages/Config/Config';
import { Showcase } from '../../Pages/showcase/showcase';
import { NewTab } from '../../Pages/NewTab/NewTab';
import { Styled } from '@danielsrs/react-native-sdk';

interface TabRendererProps {
  tabId: number;
  workspace$: Observable<Workspace>;
}

export function TabRenderer(props: TabRendererProps) {
  const { tabId, workspace$ } = props;
  const tabData = use$(workspace$.tabs[tabId]);

  if (!tabData) {
    return <NoTabData />;
  }

  const isInternalPage = tabData.state.url.startsWith('browser://');
  if (isInternalPage) {
    const url = tabData.state.url;
    if (url === 'browser://config') {
      return <Config key={tabData.id} />;
    }

    if (url === 'browser://showcase') {
      return <Showcase />;
    }

    if (url === 'browser://newTab') {
      return <NewTab />;
    }

    return <UnknownInternalTab />;
  }

  return null;
}

const NoTabData = Styled.createStyledView({
  backgroundColor: 'red',
  flex: 1,
});

const UnknownInternalTab = Styled.createStyledView({
  backgroundColor: 'yellow',
  flex: 1,
});
