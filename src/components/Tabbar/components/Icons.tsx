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

export const DismissFilled = React.memo((props: ComponentProps<typeof Svg>) => {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1.897 2.054l.073-.084a.75.75 0 01.976-.073l.084.073L6 4.939l2.97-2.97a.75.75 0 111.06 1.061L7.061 6l2.97 2.97a.75.75 0 01.072.976l-.073.084a.75.75 0 01-.976.073l-.084-.073L6 7.061l-2.97 2.97A.75.75 0 111.97 8.97L4.939 6l-2.97-2.97a.75.75 0 01-.072-.976l.073-.084-.073.084z"
        fill={props.color ?? '#212121'}
      />
    </Svg>
  );
});

export const AddRegular = React.memo((props: ComponentProps<typeof Svg>) => {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 2.5a.5.5 0 00-1 0V9H2.5a.5.5 0 000 1H9v6.5a.5.5 0 001 0V10h6.5a.5.5 0 000-1H10V2.5z"
        fill={props.color ?? '#212121'}
      />
    </Svg>
  );
});
