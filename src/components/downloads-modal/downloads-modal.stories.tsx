import { DownloadsModal } from './downloads-modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/DownloadsModal',
  component: DownloadsModal,
  argTypes: {},
  args: {
    downloads: {
      324: {
        donwloadId: 324,
        downloadedSize: 1024 * 1024 * 50, // 10 MB
        totalSize: 1024 * 1024 * 100, // 100 MB
        downloadSpeed: 1024 * 424, // 1 MB/s
        fileName: 'example-file (1).zip',
        remainingTime: 200, // seconds
        status: 'downloading',
        initiallyExpanded: false,
      },
      223: {
        donwloadId: 223,
        downloadedSize: 1024 * 1024 * 70, // 10 MB
        totalSize: 1024 * 1024 * 100, // 100 MB
        downloadSpeed: 1024 * 1024, // 1 MB/s
        fileName: 'example-file.zip',
        remainingTime: 30, // seconds
        status: 'downloading',
      },
    },
  },
} satisfies Meta<typeof DownloadsModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
