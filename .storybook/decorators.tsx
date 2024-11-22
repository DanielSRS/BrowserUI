import React, { StrictMode } from 'react';
import { SdkProvider } from 'react-native-sdk';

/**
 * Wrapps all components in <StrictMode>
 */
export function globalStrictMode(Story: () => React.ReactNode) {
  return (
    <StrictMode>
      <Story />
    </StrictMode>
  );
}

/**
 * Wrapps all components in <SdkProvider>
 */
export function globalSdkProvider(Story: () => React.ReactNode) {
  return (
    <SdkProvider
      appBackgroundProps={{
        transparentBackground: false,
      }}>
      <Story />
    </SdkProvider>
  );
}
