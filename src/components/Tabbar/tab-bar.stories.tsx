import type { Meta, StoryObj } from '@storybook/react';
import { Tabbar } from './tab-bar';
import { observable } from '@legendapp/state';
import type { Tab } from '../../store/store';

const tabs = observable<Record<number, Tab>>({
  0: {
    id: 0,
    name: 'fist tab',
    order: 1,
    url: 'browser://newTab',
  },
});

const tabIds = observable(() => Object.keys(tabs.get()));

const meta = {
  title: 'Components/Tabbar',
  component: Tabbar,
  argTypes: {
    onNewTabButtonPress: { action: 'onNewTabButtonPress' },
    selectTab: { action: 'selectTab' },
    closeTab: { action: 'closeTab' },
  },
  args: {
    tabs: tabs,
    selectedTabId: observable(0),
    tabIds: tabIds,
  },
} satisfies Meta<typeof Tabbar>;
type Story = StoryObj<typeof meta>;

export default meta;
export const Basic: Story = {};
