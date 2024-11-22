import type { Meta, StoryObj } from '@storybook/react';
import { globalPadding } from '../../../../.storybook/decorators';
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
  },
  decorators: [globalPadding],
} satisfies Meta<typeof Tab>;
type Story = StoryObj<typeof meta>;

export default meta;
export const Basic: Story = {};
export const Selected: Story = {
  args: {
    isSelected: true,
  },
};
