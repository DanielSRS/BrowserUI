import { NewTab } from './new-tab';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Features/Navigation/New Tab',
  component: NewTab,
  argTypes: {},
  args: {},
} satisfies Meta<typeof NewTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
