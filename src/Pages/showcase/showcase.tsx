import React from 'react';
import { Styled } from '@danielsrs/react-native-sdk';
import { DownloadProgress } from '../../components/download-progress/download-progress';
import { DownloadProgressWithChart } from '../../components/download-progress/download-progress-with-chart';
import { ScrollView } from 'react-native';

/**
 * Showcase of components and ui elements
 */
export function Showcase() {
  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 16 }}>
        <DownloadProgress
          fileName="namek"
          donwloadId={1}
          downloadSpeed={2}
          remainingTime={39999}
          status={'downloading'}
          downloadedSize={50}
          totalSize={100}
        />
        <DownloadProgressWithChart
          fileName="namek"
          donwloadId={1}
          downloadSpeed={2}
          remainingTime={39999}
          status={'downloading'}
          downloadedSize={50}
          totalSize={100}
        />
      </ScrollView>
    </Container>
  );
}

const Container = Styled.createStyledView({
  flex: 1,
});
