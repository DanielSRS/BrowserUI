import type { Meta, StoryObj } from '@storybook/react';
import { Topbar } from './Topbar';

const meta = {
  title: 'Components/Topbar',
  component: Topbar,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Topbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
