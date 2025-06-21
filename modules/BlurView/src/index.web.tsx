import { forwardRef } from 'react';
import { View } from 'react-native';
import type { BlurViewProps } from './index.types';

export const BlurView = forwardRef<View, BlurViewProps>((props, ref) => {
  return (
    <View
      {...props}
      ref={ref}
      style={[
        props.style,
        {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      ]}
    />
  );
});

const ComponentName = 'BlurView';

BlurView.displayName = ComponentName;
