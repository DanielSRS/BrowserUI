import React from 'react';
import { ScrollView, type ViewStyle } from 'react-native';
import { Styled, TitleLarge } from 'react-native-sdk';

export const Config = function Config() {
  return (
    <PageContainer>
      {}
      <ScrollView style={scroll} contentContainerStyle={scrollContent}>
        {}
        <MaxWidth>
          <TitleLarge>Settings page</TitleLarge>
        </MaxWidth>
      </ScrollView>
      {}
    </PageContainer>
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
