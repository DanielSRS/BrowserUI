import type { PropsWithCustomHook } from 'react-native-sdk';

type TabData = {
  readonly id: number;
  readonly name: string;
};

type TabbarStaticProps = {};
type TabbarDinamicProps = {
  readonly tabList: Readonly<Array<TabData>>;
};

export type TabbarProps = PropsWithCustomHook<
  TabbarStaticProps,
  TabbarDinamicProps,
  'useTabsData'
>;
