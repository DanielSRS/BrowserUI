import React, { useRef } from 'react';
import { Styled, useColors } from '@danielsrs/react-native-sdk';
import { AppLogo } from '../../components/Atoms/AppLogo';
import { StyleSheet, TextInput } from 'react-native';
import { Memo } from '@legendapp/state/react';

interface NewTabProps {}

export function NewTab(_props: NewTabProps) {
  const searchRef = useRef<TextInput>(null);
  const colors = useColors();

  return (
    <Memo>
      <PageContainer>
        <LogoSearchGroup>
          <AppLogo
            color={colors.fillColorControlSecondary}
            width={382 * 0.8}
            height={300 * 0.8}
          />
          <SearchBar
            // @ts-expect-error exists only on Macos
            enableFocusRing={false}
            ref={searchRef}
            placeholder={'Ask me anything'}
            style={{
              backgroundColor: colors.fillColorControlTertiary,
              borderColor: colors.strokeColorSurfaceStrokeDefault,
            }}
            placeholderTextColor={colors.fillColorTextSecondary}
          />
        </LogoSearchGroup>
      </PageContainer>
    </Memo>
  );
}

const PageContainer = Styled.createStyledView({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const LogoSearchGroup = Styled.createStyledView({
  rowGap: 32,
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: 'red',
  width: '100%',
});

const SearchBar = Styled.createStyled(TextInput, {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: StyleSheet.hairlineWidth,
  // justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  maxWidth: 450,
  width: '100%',
});
