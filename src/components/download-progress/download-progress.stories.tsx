import { DownloadProgress } from './download-progress';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/DownloadProgress',
  component: DownloadProgress,
  argTypes: {},
  args: {
    donwloadId: 324,
    downloadedSize: 1024 * 1024 * 70, // 10 MB
    totalSize: 1024 * 1024 * 100, // 100 MB
    downloadSpeed: 1024 * 1024, // 1 MB/s
    fileName: 'example-file.zip',
    remainingTime: 30, // seconds
    status: 'downloading',
  },
} satisfies Meta<typeof DownloadProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultWithProgressChart: Story = {};
export const ProgressBarOnly: Story = {
  args: {
    initiallyExpanded: false,
  },
};
