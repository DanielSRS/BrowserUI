export async function multiply(a: number, b: number): Promise<number> {
  return -1;
}

export async function hideTitleBar(): Promise<void> {
  return;
}

export async function showTitleBar(): Promise<void> {
  return;
}

export async function hideTrafficLights(): Promise<void> {
  return;
}

export async function showTrafficLights(): Promise<void> {
  return;
}

export async function animateTrafficLightsPositionTo(
  _x: number,
  _y: number,
  _duration: number,
): Promise<void> {
  return;
}

export async function changeTrafficLightsPosition(
  x: number,
  y: number,
): Promise<null> {
  return null;
}

export async function getButtonPositions(): Promise<{
  buttonsX: number;
  buttonsY: number;
}> {
  return {
    buttonsX: 0,
    buttonsY: 0,
  };
}
