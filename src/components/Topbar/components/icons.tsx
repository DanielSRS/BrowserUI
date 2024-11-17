import React, { memo, type ComponentProps } from 'react';
import Svg, { Path } from 'react-native-svg';

export const MoreHorizontalRegular = memo(
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
          d="M6.25 10a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm5 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM15 11.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
          fill={props.color ?? '#212121'}
        />
      </Svg>
    );
  },
);

export const PersonRegular = memo((props: ComponentProps<typeof Svg>) => {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 2a4 4 0 100 8 4 4 0 000-8zM7 6a3 3 0 116 0 3 3 0 01-6 0zm-1.991 5A2.001 2.001 0 003 13c0 1.691.833 2.966 2.135 3.797C6.417 17.614 8.145 18 10 18c1.855 0 3.583-.386 4.865-1.203C16.167 15.967 17 14.69 17 13a2 2 0 00-2-2H5.009zM4 13c0-.553.448-1 1.009-1H15a1 1 0 011 1c0 1.309-.622 2.284-1.673 2.953C13.257 16.636 11.735 17 10 17c-1.735 0-3.257-.364-4.327-1.047C4.623 15.283 4 14.31 4 13z"
        fill={props.color ?? '#212121'}
      />
    </Svg>
  );
});

export const ArrowLeftRegular = memo((props: ComponentProps<typeof Svg>) => {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.159 16.867a.5.5 0 10.674-.739l-6.168-5.63h13.831a.5.5 0 000-1H3.668l6.165-5.629a.5.5 0 00-.674-.738L2.243 9.445a.746.746 0 00-.24.631.746.746 0 00.24.477l6.916 6.314z"
        fill={props.color ?? '#212121'}
      />
    </Svg>
  );
});

export const ArrowRightRegular = memo((props: ComponentProps<typeof Svg>) => {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10.837 3.13a.5.5 0 00-.674.74L16.33 9.5H2.5a.5.5 0 000 1h13.828l-6.165 5.628a.5.5 0 00.674.739l6.916-6.314a.747.747 0 000-1.108L10.837 3.13z"
        fill={props.color ?? '#212121'}
      />
    </Svg>
  );
});
