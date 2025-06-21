import React, { StrictMode } from 'react';
import { SdkProvider } from '@danielsrs/react-native-sdk';
import { View } from 'react-native';
/**
 * Adds a padding of 20 to all stories
 */
export function globalPadding(Story: () => React.ReactNode) {
  return (
    <View style={globalPaddingStyle}>
      <Story />
    </View>
  );
}

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

const globalPaddingStyle = { padding: 20, flex: 1 } as const;
