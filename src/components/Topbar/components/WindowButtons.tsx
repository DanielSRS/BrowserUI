import React from 'react';
import { observer, useObservable } from '@legendapp/state/react';
import {
  changeTrafficLightsPosition,
  hideTrafficLights,
  showTrafficLights,
} from 'react-native-infinity';
import { Styled } from '@danielsrs/react-native-sdk';
import { StyleSheet } from 'react-native';

const BUTTON_WIDTH = 12;
const SPACE_BETWEEN_BUTTONS = 8;
const CONTAINER_PADDING = 8;
const BUTTONS_START_POSITION = 6 + 10; // window border size + tab icon padding

export const WindowButtons = observer(function WindowButtons() {
  const isHovered$ = useObservable(false);

  return (
    <ButtonsContainer // @ts-expect-error
      onMouseEnter={(_p: MouseEvent) => {
        isHovered$.set(true);
        changeTrafficLightsPosition(BUTTONS_START_POSITION, -4).then(
          showTrafficLights,
        );
      }}
      onMouseLeave={(_p: MouseEvent) => {
        isHovered$.set(false);
        setTimeout(() => {
          hideTrafficLights();
        }, 50);
      }}>
      {!isHovered$.get() && (
        <>
          <CloseButton />
          <MinimizeButton />
          <ZoomButton />
        </>
      )}
    </ButtonsContainer>
  );
});

const ButtonsContainer = Styled.createStyledView({
  // borderWidth: 1,
  position: 'absolute',
  // top: 20,
  // left: 0,
  flexDirection: 'row',
  paddingLeft: BUTTONS_START_POSITION + 1,
  paddingRight: CONTAINER_PADDING,
  // backgroundColor: 'black',
  height: '100%',
  alignItems: 'center',
  columnGap: SPACE_BETWEEN_BUTTONS,
  minWidth:
    3 * BUTTON_WIDTH + 2 * SPACE_BETWEEN_BUTTONS + CONTAINER_PADDING * 2,
});

const CloseButton = Styled.createStyledView({
  borderWidth: StyleSheet.hairlineWidth,
  backgroundColor: '#FF5F57',
  borderColor: '#CC4C46',
  borderRadius: 30,
  width: BUTTON_WIDTH,
  aspectRatio: 1,
});

const MinimizeButton = Styled.createStyledView({
  borderWidth: StyleSheet.hairlineWidth,
  backgroundColor: '#FEBC2E',
  borderColor: '#CB9625',
  borderRadius: 30,
  width: BUTTON_WIDTH,
  aspectRatio: 1,
});

const ZoomButton = Styled.createStyledView({
  borderWidth: StyleSheet.hairlineWidth,
  backgroundColor: '#28C840',
  borderColor: '#20A033',
  borderRadius: 30,
  width: BUTTON_WIDTH,
  aspectRatio: 1,
});
