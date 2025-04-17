import React from 'react';
import type { Observable, ObservablePrimitive } from '@legendapp/state';
import { Computed } from '@legendapp/state/react';
import {
  Body,
  BodyStrong,
  Caption,
  Styled,
  useColors,
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
}

/**
 * DownloadProgress component. It displays the progress of a file download.
 * It shows the file name, download speed, remaining time, and a progress bar.
 * It also has a stop button to cancel the download.
 * @param props Download progress information
 */
export function DownloadProgressWithChart(props: DownloadProgressProps) {
  const { totalSize, downloadedSize, fileName, downloadSpeed } = props;
  const colors = useColors();

  const iconColor = colors.textPrimary;

  return (
    <Container
      style={{
        // backgroundColor: colors.backgroundFillColorAcrylicBackgroundDefault,
        backgroundColor: colors.backgroundFillColorSolidBackgroundBase,
        borderColor: colors.strokeColorSurfaceStrokeDefault,
      }}>
      <Top>
        <TopLeft>
          {/* <FileIconContainer
            style={{
              backgroundColor: colors.fillColorControlSecondary,
              borderRadius: 20,
            }}>
          </FileIconContainer> */}
          <Document16Regular color={iconColor} />
          {/* Item name */}
          <Body>{fileName}</Body>
        </TopLeft>

        {/* Stop Button */}
        <IconContainer style={{ width: 36, height: 36 }}>
          <Dismiss16Regular color={iconColor} />
        </IconContainer>
      </Top>
      <Bottom>
        <ProgressContainer>
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
              <Caption style={{ fontSize: 10 }}>Speed:</Caption>
              <BodyStrong style={{ fontSize: 12, marginTop: -4 }}>
                <Computed>
                  {formatDownloadSpeed(
                    isObservable(downloadSpeed)
                      ? downloadSpeed.get()
                      : downloadSpeed,
                  )}
                </Computed>
              </BodyStrong>
            </SpeedOverlay>
          </SpeedChart>
          <Row>
            <ProgressCaptionGroup>
              <Caption style={{ opacity: 0.8, paddingBottom: 6 }}>
                {formatDownloadedSize(
                  isObservable(downloadedSize)
                    ? downloadedSize.get()
                    : downloadedSize,
                )}
                {' of '}
                {formatTotalSize(totalSize)}
              </Caption>
              <Caption
                style={{
                  // opacity: 0.8,
                  paddingBottom: 6,
                  marginTop: -8,
                  fontWeight: 'bold',
                  fontSize: 11,

                  color: colors.accentDefault,
                }}>
                {formatRemainingTime(
                  isObservable(props.remainingTime)
                    ? props.remainingTime.get()
                    : props.remainingTime,
                )}
                {' left'}
              </Caption>
            </ProgressCaptionGroup>
            <IconContainer style={{ borderWidth: 0 }}>
              <ChevronUp16Regular color={iconColor} />
            </IconContainer>
          </Row>
        </ProgressContainer>
      </Bottom>
    </Container>
  );
}

const Container = Styled.createStyledView({
  borderWidth: 1,
  maxWidth: 320,
  paddingLeft: 8,
  // paddingRight: 4,
  // paddingTop: 4,
  // paddingBottom: 8,
  borderRadius: 8,
  // overflow: 'hidden',
});

const Top = Styled.createStyledView({
  flexDirection: 'row',
  // alignItems: 'center',
  // paddingTop: 2,
  // backgroundColor: 'red',
});

const ProgressContainer = Styled.createStyledView({
  flex: 1,
  // paddingLeft: 6,
  rowGap: 4,
  // backgroundColor: 'purple',
});

const SpeedChart = Styled.createStyledView({
  // backgroundColor: 'cyan',
  paddingRight: 8,
});
const ProgressCaptionGroup = Styled.createStyledView({
  // backgroundColor: 'magenta',
});
const Row = Styled.createStyledView({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const SpeedOverlay = Styled.createStyledView({
  position: 'absolute',
  top: 0,
  right: 0,
  alignItems: 'flex-end',
  paddingTop: 4,
  paddingRight: 12,
  // backgroundColor: 'white',
});

const Bottom = Styled.createStyledView({
  flexDirection: 'row',
  alignItems: 'flex-start',
  // backgroundColor: 'green',
  // paddingLeft: 8,
});
const TopLeft = Styled.createStyledView({
  flexDirection: 'row',
  alignItems: 'center',
  // paddingLeft: 2,
  // paddingRight: 4,
  paddingTop: 8,
  paddingBottom: 8,
  columnGap: 8,
  // backgroundColor: 'blue',
  flex: 1,
});

const IconContainer = Styled.createStyledView({
  width: 40,
  height: 40,
  // backgroundColor: 'white',
  // borderWidth: 1,
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
