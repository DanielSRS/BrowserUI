import React, { type ComponentProps } from 'react';
import Svg, { Path } from 'react-native-svg';

export const TabDesktopNewPageRegular = React.memo(
  (props: ComponentProps<typeof Svg>) => {
    return (
      <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        // xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <Path
          d="M7 12a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zM3 5.5A2.5 2.5 0 015.5 3h9A2.5 2.5 0 0117 5.5v9a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 14.5v-9zM5.5 4A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16h9a1.5 1.5 0 001.5-1.5V7H9.5A1.5 1.5 0 018 5.5V4H5.5zM16 5.5A1.5 1.5 0 0014.5 4H9v1.5a.5.5 0 00.5.5H16v-.5z"
          fill={props.color ?? '#212121'}
        />
      </Svg>
    );
  },
);
