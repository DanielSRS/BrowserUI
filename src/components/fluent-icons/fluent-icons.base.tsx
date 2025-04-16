import React from 'react';
import type { ComponentProps } from 'react';
import Svg, { Path } from 'react-native-svg';

export const iconBuilder =
  (d: string, w?: number, h?: number) =>
  (props?: ComponentProps<typeof Svg>) => {
    const width = props?.width ?? w ?? 20;
    const height = props?.height ?? h ?? 20;
    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        // xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <Path d={d} fill={props?.color ?? '#212121'} />
      </Svg>
    );
  };

export type Fluenticon = (
  props?: ComponentProps<typeof Svg>,
) => React.JSX.Element;
