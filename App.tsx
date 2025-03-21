import React, { StrictMode } from 'react';
import { App } from './src/AppEntry';
import { SdkProvider } from '@danielsrs/react-native-sdk';

export default () => {
  return (
    <StrictMode>
      <SdkProvider>
        <App />
      </SdkProvider>
    </StrictMode>
  );
};
// export { default } from './.storybook';
