import { Styled, useColors } from '@danielsrs/react-native-sdk';
import React from 'react';
import { CurveType, LineChart } from 'react-native-gifted-charts';

interface DownloadProgressChartProps {
  progress: number;
}

export function DownloadProgressChart(props: DownloadProgressChartProps) {
  const { progress } = props;
  const [chartWidth, setChartWidth] = React.useState<number | undefined>();

  const colors = useColors();
  const data = [
    { value: 0 },
    { value: 10 },
    { value: 8 },
    { value: 58 },
    { value: 56 },
    { value: 78 },
    { value: 74 },
    { value: 66 },
    { value: 98 },
    { value: 8 },
    { value: 98 },
    { value: 0 },
    { value: 15 },
    { value: 0 },
    { value: 0 },
    { value: 98 },
    { value: 0 },
    { value: 56 },
    { value: 56 },
    { value: 78 },
    { value: 56 },
    { value: 78 },
    { value: 56 },
    { value: 78 },
  ];
  return (
    <Container
      style={{
        borderColor: colors.strokeColorSurfaceStrokeDefault,
      }}
      onLayout={e => {
        setChartWidth(e.nativeEvent.layout.width);
      }}>
      {/* <Body>{chartWidth}</Body>
      <Body>{data.length}</Body>
      <Body>{space}</Body> */}
      <PositionShift>
        <LineChart
          data={data}
          hideYAxisText
          initialSpacing={0}
          hideRules
          hideAxesAndRules
          yAxisThickness={0}
          xAxisThickness={0}
          disableScroll
          hideOrigin
          adjustToWidth={true}
          parentWidth={
            chartWidth ? chartWidth * (progress / 100) + 10 : undefined
          }
          showXAxisIndices={false}
          xAxisLabelsHeight={0}
          // pointerConfig={{}}
          // isAnimated
          // animateOnDataChange
          areaChart
          curved
          curveType={CurveType.QUADRATIC}
          // curvature={}
          // spacing={space}
          color1={colors.accentDefault.toString()}
          startFillColor={colors.accentDefault.toString()}
          startOpacity={0.5}
          endFillColor={colors.accentDefault.toString()}
          endOpacity={0.1}
          showYAxisIndices={false}
          hideDataPoints1
          height={58}
          // disableScroll
          // width={chartWidth}
        />
      </PositionShift>
      <Progress
        style={{
          backgroundColor: colors.accentDefault,
          width: `${progress + 0.5}%`,
          opacity: 0.1,
        }}
      />
    </Container>
  );
}

const Container = Styled.createStyledView({
  borderWidth: 1,
  borderRadius: 4,
  overflow: 'hidden',
  // maxWidth: 260,
});

const PositionShift = Styled.createStyledView({
  marginLeft: -10,
  marginBottom: -6,
});

const Progress = Styled.createStyledView({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
});
//   flexDirection: 'row',
