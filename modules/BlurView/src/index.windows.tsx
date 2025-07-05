import { forwardRef } from 'react';
import { PlatformColor, View } from 'react-native';
import { Constants, useColors } from '@danielsrs/react-native-sdk';
import type { BlurViewProps } from './index.types';

export const BlurView = forwardRef<View, BlurViewProps>((props, ref) => {
  const colors = useColors();
  return (
    <View
      {...props}
      ref={ref}
      style={[
        props.style,
        {
          backgroundColor: Constants.IS_FABRIC_ENABLED
            ? colors.fillColorControlSolidDefault
            : PlatformColor('SystemControlAcrylicWindowBrush'),
        },
      ]}
    />
  );
});

const ComponentName = 'BlurView';

BlurView.displayName = ComponentName;
