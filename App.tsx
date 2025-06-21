import React, { StrictMode } from 'react';
import { App } from './src/AppEntry';
import { SdkProvider } from '@danielsrs/react-native-sdk';

export function app() {
  return (
    <StrictMode>
      <SdkProvider>
        <App />
      </SdkProvider>
    </StrictMode>
  );
}

let AppEntryPoint = app;

if (process.env.STORYBOOK_ENABLED) {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
