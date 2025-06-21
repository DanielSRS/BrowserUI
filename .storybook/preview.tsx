import { Preview } from '@storybook/react';
import {
  globalSdkProvider,
  globalStrictMode,
} from '../.rnstorybook/decorators';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [globalStrictMode, globalSdkProvider],
};

export default preview;
