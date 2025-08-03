import { Styled } from '@danielsrs/react-native-sdk';
import { Callout } from '@fluentui-react-native/callout';
import { Show, useObservable } from '@legendapp/state/react';
import { useRef, type ComponentProps, type FC } from 'react';
import {
  Pressable,
  type LayoutRectangle,
  type View,
  type ViewStyle,
} from 'react-native';
import {
  addBlocker,
  removeBlocker,
} from '../../flyout-backdrop/flyout-backdrop';

type EC<N> = (props: {
  onPress?: (e: any) => void;
  children: N;
}) => React.ReactNode;

interface FlyoutProps<T, C extends EC<T>> {
  target: {
    component: C;
    children: T;
  };
  children?: React.ReactNode;
}

export function Flyout<T, C extends EC<T>>(props: FlyoutProps<T, C>) {
  const {
    target: { component, children: targetChildren },
    children,
  } = props;
  const show$ = useObservable(false);
  const targetLayout = useObservable<LayoutRectangle>();
  const targetRef = useRef<View>({} as View);
  const closedAt = useObservable<number | undefined>(Date.now());
  const open = () => {
    if (!targetLayout.peek()) {
      // if the target layout is not set, it means the target is not rendered yet
      return;
    }
    const closedTime = closedAt.peek();
    if (!closedTime) {
      return; // it is open already
    }
    const timeSinceClosed = Date.now() - closedTime;
    if (timeSinceClosed < 500) {
      // if it was closed less than 500ms ago, do not reopen
      return;
    }
    closedAt.set(undefined);
    addBlocker();
    show$.set(true);
  };
  const close = () => {
    closedAt.set(Date.now());
    removeBlocker();
    show$.set(false);
  };
  const TargetComponent: FC<ComponentProps<EC<T>>> = component;
  return (
    <Container>
      <Pressable
        ref={targetRef}
        onPress={open}
        onLayout={event => {
          targetLayout.set(event.nativeEvent.layout);
        }}>
        <TargetComponent onPress={open}>{targetChildren}</TargetComponent>
      </Pressable>
      <Show ifReady={show$}>
        <Callout
          target={targetRef}
          gapSpace={10}
          onDismiss={close}
          allowsVibrancy
          borderColor={'red'}
          style={calloutStyle}>
          <Content>{children}</Content>
        </Callout>
      </Show>
    </Container>
  );
}

const calloutStyle = {
  borderRadius: 8,
  borderWidth: 0,
} satisfies ViewStyle;

const Container = Styled.createStyledView({});

const Content = Styled.createStyledView({});
