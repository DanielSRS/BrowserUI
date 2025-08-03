import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import { Pressable, type ViewStyle } from 'react-native';

export const Blocker$ = observable(0);

export const addBlocker = () => {
  Blocker$.set(Blocker$.peek() + 1);
};

export const removeBlocker = () => {
  Blocker$.set(Math.max(0, Blocker$.peek() - 1));
};

export function FlyoutBackdrop() {
  const blocker = useSelector(Blocker$);
  if (blocker === 0) {
    return null; // do not render the backdrop if there are no blockers
  }
  return <Blocker style={blockerStyles} />;
}

const Blocker = Pressable;

const blockerStyles = {
  // backgroundColor: 'red',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
} satisfies ViewStyle;
