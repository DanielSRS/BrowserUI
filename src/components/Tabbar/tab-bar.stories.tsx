import type { Meta, StoryObj } from '@storybook/react';
import { Tabbar } from './tab-bar';
import { observable } from '@legendapp/state';

// const TABS = [
//   { id: 0, name: 'New Tab' },
//   { id: 1, name: 'New Tab' },
//   { id: 2, name: 'New Tab' },
//   { id: 3, name: 'New Tab' },
//   { id: 4, name: 'New Tab' },
//   { id: 5, name: 'New Tab' },
//   { id: 6, name: 'New Tab' },
//   { id: 7, name: 'New Tab' },
//   { id: 8, name: 'New Tab' },
//   { id: 9, name: 'New Tab' },
//   { id: 10, name: 'New Tab' },
//   { id: 11, name: 'New Tab' },
//   { id: 12, name: 'New Tab' },
//   { id: 13, name: 'New Tab' },
//   { id: 14, name: 'New Tab' },
//   { id: 15, name: 'New Tab' },
//   { id: 16, name: 'New Tab' },
//   { id: 17, name: 'New Tab' },
//   { id: 18, name: 'New Tab' },
//   { id: 19, name: 'New Tab' },
//   { id: 20, name: 'New Tab' },
//   { id: 21, name: 'New Tab' },
//   { id: 22, name: 'New Tab' },
//   { id: 23, name: 'New Tab' },
//   { id: 24, name: 'New Tab' },
//   { id: 25, name: 'New Tab' },
//   { id: 26, name: 'New Tab' },
//   { id: 27, name: 'New Tab' },
//   { id: 28, name: 'New Tab' },
//   { id: 29, name: 'New Tab' },
//   { id: 30, name: 'New Tab' },
// ] as const;

const meta = {
  title: 'Components/Tabbar',
  component: Tabbar,
  argTypes: {
    onNewTabButtonPress: { action: 'onNewTabButtonPress' },
    selectTab: { action: 'selectTab' },
    closeTab: { action: 'closeTab' },
  },
  args: {
    tabs: {
      get: () => [
        {
          id: 0,
          name: 'fist tab',
          order: 1,
          url: 'browser://newTab',
        },
      ],
    },
    selectedTabId: observable(0),
  },
} satisfies Meta<typeof Tabbar>;
type Story = StoryObj<typeof meta>;

export default meta;
export const Basic: Story = {};
