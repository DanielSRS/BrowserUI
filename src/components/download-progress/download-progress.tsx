import React from 'react';
import type { Observable, ObservablePrimitive } from '@legendapp/state';
import { Computed, useObservable } from '@legendapp/state/react';
import { Animated } from 'react-native';
import {
  BodyStrong,
  Caption,
  Styled,
  useColors,
  ZStack,
} from '@danielsrs/react-native-sdk';
import {
  ChevronUp16Regular,
  Dismiss16Regular,
  Document16Regular,
} from '../fluent-icons/fluent-icons';
import { DownloadProgressChart } from './progress-chart';

interface DownloadProgressProps {
  /**
   * The name of the file being downloaded
   */
  fileName: string;
  /**
   * The download ID
   */
  donwloadId: number;
  /**
   * The download speed in bytes per second
   */
  downloadSpeed: ObservablePrimitive<number> | number;
  /**
   * The remaining time in seconds
   */
  remainingTime: ObservablePrimitive<number> | number;
  /**
   * The total size of the file in bytes
   */
  totalSize: number;
  /**
   * The downloaded size in bytes
   */
  downloadedSize: number;
  /**
   * The download status
   */
  status: 'downloading' | 'paused' | 'completed';
  /**
   * Whether the component should be initially expanded
   * to show the speed chart.
   *
   * Defaults to true.
   *
   * @default true
   */
  initiallyExpanded?: boolean;
}

/**
 * DownloadProgress component. It displays the progress of a file download.
 * It shows the file name, download speed, remaining time, and a progress bar.
 * It also has a stop button to cancel the download.
 * @param props Download progress information
 */
export function DownloadProgress(props: DownloadProgressProps) {
  const {
    totalSize,
    downloadedSize,
    fileName,
    downloadSpeed,
    initiallyExpanded = true,
  } = props;
  const colors = useColors();

  /**
   * The progress style is calculated based on the downloaded size and total size.
   * It is used to set the width of the progress bar.
   */
  const progressStyle = useObservable(() => {
    const downloaded = isObservable(downloadedSize)
      ? downloadedSize.get()
      : downloadedSize;
    const progress = calculatePercentage(totalSize, downloaded);
    const width = Math.min(progress, 100);
    return {
      width: `${width}%`,
    } as const;
  });

  const iconColor = colors.textPrimary;

  return (
    <Container
      style={{
        backgroundColor: colors.backgroundFillColorAcrylicBackgroundDefault,
        borderColor: colors.strokeColorSurfaceStrokeDefault,
      }}>
      <Top>
        <IconContainer>
          <Document16Regular color={iconColor} />
        </IconContainer>
        <FileName>{fileName}</FileName>

        {/* Stop Button */}
        <IconContainer>
          <ChevronUp16Regular color={iconColor} />
        </IconContainer>
      </Top>
      <Bottom>
        {initiallyExpanded && (
          <SpeedChart>
            <Computed>
              <DownloadProgressChart
                progress={calculatePercentage(
                  totalSize,
                  isObservable(downloadedSize)
                    ? downloadedSize.get()
                    : downloadedSize,
                )}
              />
            </Computed>
            <SpeedOverlay>
              <SpeedCaption>Speed:</SpeedCaption>
              <SpeedInfo>
                <Computed>
                  {formatDownloadSpeed(
                    isObservable(downloadSpeed)
                      ? downloadSpeed.get()
                      : downloadSpeed,
                  )}
                </Computed>
              </SpeedInfo>
            </SpeedOverlay>
          </SpeedChart>
        )}
        {!initiallyExpanded && (
          <ProgressContainer>
            <Track />
            <Computed>
              <ProgressLine
                style={[
                  { backgroundColor: colors.accentDefault },
                  progressStyle.get(),
                ]}
              />
            </Computed>
          </ProgressContainer>
        )}
        <InfoContainer>
          <DownloadStats>
            <Computed>
              {formatDownloadSpeed(
                isObservable(downloadSpeed)
                  ? downloadSpeed.get()
                  : downloadSpeed,
              )}
            </Computed>
            {' - '}
            {formatDownloadedSize(
              isObservable(downloadedSize)
                ? downloadedSize.get()
                : downloadedSize,
            )}
            {' of '}
            {formatTotalSize(totalSize)}
            {', '}
            {formatRemainingTime(
              isObservable(props.remainingTime)
                ? props.remainingTime.get()
                : props.remainingTime,
            )}
            {' left'}
          </DownloadStats>
          <IconContainer>
            <Dismiss16Regular color={iconColor} />
          </IconContainer>
        </InfoContainer>
      </Bottom>
    </Container>
  );
}

const Container = Styled.createStyledView({
  borderWidth: 1,
  maxWidth: 326, // remove
  padding: 12,
  rowGap: 12,
  borderRadius: 3,
});

const SpeedChart = Styled.createStyledView({});

const SpeedOverlay = Styled.createStyledView({
  position: 'absolute',
  top: 0,
  right: 0,
  alignItems: 'flex-end',
  paddingTop: 4,
  paddingRight: 4,
  // rowGap: 2,
  // backgroundColor: 'white',
});

const SpeedCaption = Styled.createStyled(Caption, {
  fontSize: 10,
  opacity: 0.8,
});

const SpeedInfo = Styled.createStyled(BodyStrong, {
  fontSize: 12,
  marginTop: -2,
});

const Top = Styled.createStyledView({
  flexDirection: 'row',
  gap: 8,
});

const FileName = Styled.createStyled(Caption, {
  flex: 1,
});

const DownloadStats = Styled.createStyled(Caption, {
  flex: 1,
});

const ProgressLine = Styled.createStyled(Animated.View, {
  height: 3,
  borderRadius: 8,
});

const ProgressContainer = Styled.createStyled(ZStack, {
  flex: 1,
  justifyContent: 'center',
  maxHeight: 3,
  minHeight: 3,
});

const Track = Styled.createStyledView({
  flex: 1,
  backgroundColor: 'gray',
  maxHeight: 1,
  height: 1,
  marginVertical: 1,
});

const Bottom = Styled.createStyledView({
  gap: 8,
});

const InfoContainer = Styled.createStyledView({
  gap: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const IconContainer = Styled.createStyledView({
  width: 16,
  height: 16,
  justifyContent: 'center',
  alignItems: 'center',
});

function isObservable<T>(value: T | Observable<T>): value is Observable<T> {
  return (value as Observable<T>).get !== undefined;
}

// function to calculate percentage
function calculatePercentage(
  totalSize: number,
  downloadedSize: number,
): number {
  if (totalSize === 0) {
    return 0;
  }
  return (downloadedSize / totalSize) * 100;
}

/**
 * Format the download speed to a human-readable format
 * @param speed The download speed in bytes per second
 * @returns The formatted download speed
 */
function formatDownloadSpeed(speed: number): string {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let i = 0;
  while (speed >= 1024 && i < units.length - 1) {
    speed /= 1024;
    i++;
  }
  return `${speed.toFixed(2)} ${units[i]}`;
}

/**
 * Format the remaining time to a human-readable format
 * @param time The remaining time in seconds
 * @returns The formatted remaining time
 */
function formatRemainingTime(time: number): string {
  const units = ['s', 'm', 'h'];
  let i = 0;
  while (time >= 60 && i < units.length - 1) {
    time /= 60;
    i++;
  }
  return `${time.toFixed(0)} ${units[i]}`;
}
/**
 * Format the total size to a human-readable format
 * @param size The total size in bytes
 * @returns The formatted total size
 */
function formatTotalSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}
/**
 * Format the downloaded size to a human-readable format
 * @param size The downloaded size in bytes
 * @returns The formatted downloaded size
 */
function formatDownloadedSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}
/**
 * Format the download status to a human-readable format
 * @param status The download status
 * @returns The formatted download status
 */
// function formatDownloadStatus(status: 'downloading' | 'paused' | 'completed') {
//   switch (status) {
//     case 'downloading':
//       return 'Downloading';
//     case 'paused':
//       return 'Paused';
//     case 'completed':
//       return 'Completed';
//     default:
//       return 'Unknown';
//   }
// }
