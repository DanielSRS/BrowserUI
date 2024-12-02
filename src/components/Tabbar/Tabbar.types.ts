import type { PropsWithCustomHook } from 'react-native-sdk';
import type { Workspace } from '../../store/store';
import type { Observable } from '@legendapp/state';

type TabbarStaticProps = {
  workspace: Observable<Workspace>;
};

export type TabbarDinamicProps = {
  // readonly tabList: Readonly<Array<Tab>>;
  // selectedTabId: number;
  // onTabPress?: (tabId: number) => void;
  // onTabClose?: (tabId: number) => void;
  // onNewTabPress?: () => void;
  // len: number;
};

export type TabbarProps = PropsWithCustomHook<
  TabbarStaticProps,
  TabbarDinamicProps,
  'useTabsData'
>;
