import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';

const meta = {
  title: 'Components/Tabbar/Tab',
  component: Tab,
  argTypes: {
    onPress: { action: 'onPress' },
  },
  args: {
    id: 1,
    name: 'New Tab',
    selectedTabId: 0,
  },
} satisfies Meta<typeof Tab>;
type Story = StoryObj<typeof meta>;

export default meta;
export const Basic: Story = {};
export const Selected: Story = {
  args: {
    selectedTabId: 1,
  },
};
