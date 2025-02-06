import React from 'react';
import { Memo, useObservable } from '@legendapp/state/react';
import { ScrollView, type ViewStyle } from 'react-native';
import { Styled, TitleLarge } from 'react-native-sdk';
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
    <Memo>
      {() => (
        <PageContainer style={style$.get()}>
          {}
          <ScrollView style={scroll} contentContainerStyle={scrollContent}>
            {}
            <MaxWidth>
              <TitleLarge>Settings page</TitleLarge>
            </MaxWidth>
          </ScrollView>
          {}
        </PageContainer>
      )}
    </Memo>
  );
};

const PageContainer = Styled.createStyledView({
  flex: 1,
});

const MaxWidth = Styled.createStyledView({
  maxWidth: 900,
  width: '100%',
  rowGap: 20,
  alignItems: 'center',
});

const scrollContent: ViewStyle = {
  paddingHorizontal: 16,
  // backgroundColor: 'red',
  alignItems: 'center',
};
const scroll: ViewStyle = {
  flex: 1,
};
