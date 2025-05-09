import React from 'react';
import type { ComponentProps } from 'react';
import { AppState } from 'react-native';
import Svg from 'react-native-svg';
import { Path } from 'react-native-xaml';

AppState.addEventListener('change', nextAppState => {
  if (nextAppState === 'active') {
    // AppStateCount$.set(v => v + 1);
  }
});

export const iconBuilder =
  (d: string, w?: number, h?: number) =>
  (props?: Pick<ComponentProps<typeof Svg>, 'width' | 'height' | 'color'>) => {
    const width = props?.width ?? w ?? 20;
    const height = props?.height ?? h ?? 20;
    return (
      <Path
        width={+width}
        height={+height}
        data={d}
        fill={props?.color ?? '#212121'}
        pointerEvents="none"
      />
    );
  };

export type Fluenticon = (
  props?: ComponentProps<typeof Svg>,
) => React.JSX.Element;
