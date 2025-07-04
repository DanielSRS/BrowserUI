import React from 'react';
import { Computed } from '@legendapp/state/react';
import {
  LayoutAnimation,
  ScrollView,
  type LayoutAnimationConfig,
  type ViewStyle,
} from 'react-native';
import {
  Button,
  Styled,
  TitleLarge,
  SetColorScheme,
  BodyLarge,
} from '@danielsrs/react-native-sdk';
import { settings } from '../../store/store';

interface ConfigTabProps {}
const animationConfig: LayoutAnimationConfig = {
  duration: 300,
  create: {
    type: 'linear',
    property: 'opacity',
  },
  update: {
    type: 'spring',
    springDamping: 0.4,
  },
  delete: {
    type: 'linear',
    property: 'opacity',
  },
};
export const Config = function Config(_props: ConfigTabProps) {
  return (
    <Computed>
      <PageContainer>
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

            <Computed>
              <BodyLarge>TopBar</BodyLarge>
            </Computed>
            <SpacedRow>
              <Button
                disabled={settings.isTopBarExpanded.get()}
                onPress={() => {
                  LayoutAnimation.configureNext(animationConfig);
                  settings.isTopBarExpanded.set(true);
                }}>
                Expanded
              </Button>
              <Button
                disabled={!settings.isTopBarExpanded.get()}
                onPress={() => {
                  LayoutAnimation.configureNext(animationConfig);
                  settings.isTopBarExpanded.set(false);
                }}>
                Colapsed
              </Button>
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
