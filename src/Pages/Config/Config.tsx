import React from 'react';
import { Computed, useObservable } from '@legendapp/state/react';
import { ScrollView, type ViewStyle } from 'react-native';
import {
  Button,
  Styled,
  TitleLarge,
  SetColorScheme,
  BodyLarge,
} from '@danielsrs/react-native-sdk';
import type { ObservablePrimitive } from '@legendapp/state';

interface ConfigTabProps {
  tabId: number;
  selectedTab: ObservablePrimitive<number>;
}
export const Config = function Config(props: ConfigTabProps) {
  const { selectedTab, tabId } = props;
  const isSelected$ = useObservable(() => selectedTab.get() === tabId);
  const style$ = useObservable(() =>
    isSelected$.get()
      ? undefined
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const),
  );
  return (
    <Computed>
      <PageContainer style={style$.get()}>
        {}
        <ScrollView style={scroll} contentContainerStyle={scrollContent}>
          {}
          <MaxWidth>
            <Title>Settings page</Title>

            <BodyLarge>App theme</BodyLarge>
            <SpacedRow>
              <Button onPress={() => SetColorScheme('dark')}>Dark</Button>
              <Button onPress={() => SetColorScheme('light')}>Light</Button>
              <Button onPress={() => SetColorScheme('system')}>System</Button>
            </SpacedRow>
          </MaxWidth>
        </ScrollView>
        {}
      </PageContainer>
    </Computed>
  );
};

const Title = Styled.createStyled(TitleLarge, {
  alignSelf: 'center',
});

const PageContainer = Styled.createStyledView({
  flex: 1,
});

const MaxWidth = Styled.createStyledView({
  maxWidth: 900,
  width: '100%',
  rowGap: 20,
});

const SpacedRow = Styled.createStyledView({
  flexDirection: 'row',
  columnGap: 10,
});

const scrollContent: ViewStyle = {
  paddingHorizontal: 16,
  // backgroundColor: 'red',
  alignItems: 'center',
};
const scroll: ViewStyle = {
  flex: 1,
};
