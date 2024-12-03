import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package 'react-native-infinity' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const _Infinity = NativeModules.Infinity
  ? NativeModules.Infinity
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function multiply(a: number, b: number): Promise<number> {
  return _Infinity.multiply(a, b);
}

export function hideTitleBar(): Promise<void> {
  return _Infinity.hideTitleBar();
}

export function showTitleBar(): Promise<void> {
  return _Infinity.showTitleBar();
}

export function hideTrafficLights(): Promise<void> {
  return _Infinity.hideTrafficLights();
}

export function showTrafficLights(): Promise<void> {
  return _Infinity.showTrafficLights();
}

export async function animateTrafficLightsPositionTo(
  x: number,
  y: number,
  duration: number,
): Promise<void> {
  return _Infinity.animateTrafficLights(x, y, duration);
}

export function changeTrafficLightsPosition(
  x: number,
  y: number,
): Promise<null> {
  return _Infinity.changeTrafficLightsPosition(x, y);
}

export function getButtonPositions(): Promise<{
  buttonsX: number;
  buttonsY: number;
}> {
  return _Infinity.getButtonPositions();
}
