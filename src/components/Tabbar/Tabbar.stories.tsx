import type { Meta, StoryObj } from '@storybook/react';
import { Tabbar } from './Tabbar';

const meta = {
  title: 'Components/Tabbar',
  component: Tabbar,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Tabbar>;
type Story = StoryObj<typeof meta>;

export default meta;
export const Basic: Story = {};
