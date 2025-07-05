import { Body, Caption, Styled, useColors } from '@danielsrs/react-native-sdk';
import { Pressable } from 'react-native';
import { isObservable, type Observable } from '@legendapp/state';
import {
  DownloadProgress,
  type DownloadProgressProps,
} from '../download-progress/download-progress';
import { useCallback } from 'react';
import { Computed, Memo } from '@legendapp/state/react';
import { LegendList, type LegendListRenderItemProps } from '@legendapp/list';

// #region Main Component
type DownloadRegistry = Record<string, DownloadProgressProps>;

interface DownloadsModalProps {
  downloads: Observable<DownloadRegistry> | DownloadRegistry;
}

export function DownloadsModal(props: DownloadsModalProps) {
  const { downloads } = props;
  const colors = useColors();
  const renderDownload = useCallback(
    function ({ item }: LegendListRenderItemProps<string>) {
      return (
        <Memo>
          {() => {
            const data = isObservable(downloads)
              ? downloads[item].get()
              : downloads[item];
            return <DownloadProgress {...data} />;
          }}
        </Memo>
      );
    },
    [downloads],
  );
  return (
    <Container
      style={{
        borderColor: colors.strokeColorSurfaceStrokeDefault,
        backgroundColor: colors.backgroundFillColorSolidBackgroundBase,
      }}>
      {}
      <Header />
      {}
      <Computed>
        {() => {
          const data = isObservable(downloads)
            ? downloads.get(true)
            : downloads;
          const ids = Object.keys(data);
          return (
            <LegendList
              data={ids}
              renderItem={renderDownload}
              contentContainerStyle={listContentContainerStyle}
              keyExtractor={item => item}
              recycleItems
              estimatedItemSize={140}
            />
          );
        }}
      </Computed>
    </Container>
  );
}

const listContentContainerStyle = {
  paddingHorizontal: 4,
  gap: 4,
  paddingBottom: 4,
} as const;

const Container = Styled.createStyledView({
  borderRadius: 8,
  width: 336,
  borderWidth: 1,
  boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.14)',
  shadowColor: 'rgb(0, 0, 0)',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.14,
  shadowRadius: 16,
});
// #endregion

// #region Headeer

interface HeaderProps {}

export function Header(props: HeaderProps) {
  const {} = props;
  return (
    <HeaderContainer>
      {}
      <HeaderTittle>Downloads</HeaderTittle>
      {}
      <HeaderButton>
        <Caption> ... </Caption>
      </HeaderButton>
      {}
    </HeaderContainer>
  );
}

const HeaderContainer = Styled.createStyledView({
  flexDirection: 'row',
  // backgroundColor: 'red',
  paddingHorizontal: 16,
  paddingVertical: 12,
});

const HeaderTittle = Styled.createStyled(Body, {
  flex: 1,
});

const HeaderButton = Styled.createStyled(Pressable, {
  borderWidth: 1,
  borderRadius: 4,
  borderColor: 'rgba(0, 0, 0, 0.15)',
  // padding: 2,
  paddingHorizontal: 6,
  backgroundColor: 'white',
}) as typeof Pressable;

// #endregion
