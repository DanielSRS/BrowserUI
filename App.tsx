import React, { StrictMode } from 'react';
import { App } from './src/AppEntry';
import { SdkProvider, Constants } from '@danielsrs/react-native-sdk';
import { enableScreens } from 'react-native-screens';
import { loadAdblockerFilters } from './src/adblocker/engine';

loadAdblockerFilters();

if (Constants.IS_WINDOWS) {
  enableScreens(false);
}

export function app() {
  return (
    <StrictMode>
      <SdkProvider
        appBackgroundProps={{
          useAcrylic: !Constants.IS_WINDOWS,
          transparentBackground: !Constants.IS_WINDOWS,
        }}>
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
