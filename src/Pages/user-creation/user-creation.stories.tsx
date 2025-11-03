import { fn } from 'storybook/test';
import { UserCreation } from './user-creation';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'Pages/UserCreation',
  component: UserCreation,
  tags: ['autodocs'],
  args: { onUserCreated: fn() },
} satisfies Meta<typeof UserCreation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
