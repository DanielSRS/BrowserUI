import React from 'react';
import { App } from './src/AppEntry';
import { SdkProvider } from 'react-native-sdk';

export default () => {
  return (
    <SdkProvider>
      <App />
    </SdkProvider>
  );
};
