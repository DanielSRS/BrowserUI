import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  multiply,
  hideTitleBar,
  hideTrafficLights,
  showTitleBar,
  showTrafficLights,
  animateTrafficLightsPositionTo,
} from 'react-native-infinity';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/Tabbar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { useColors } from 'react-native-sdk';

const WINDOW_BORDER_SIZE = 6;

export function App() {
  const colors = useColors();
  return (
    <View style={[styles.window]}>
      {/* Nav bar */}
      <ExpandOnHover>
        <Topbar />
      </ExpandOnHover>
      <View style={styles.row}>
        {/* Tabbar */}
        <Tabbar />
        {/* Content container */}
        <View
          style={[
            styles.contentArea,
            { borderColor: colors.strokeColorDividerStrokeDefault },
          ]}>
          {/* Content */}
          <View style={styles.content}>
            <Button
              title="multiply"
              onPress={async () => {
                try {
                  const res = await multiply(1, 2);
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="hide title bar"
              onPress={async () => {
                try {
                  await hideTitleBar();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="show title bar"
              onPress={async () => {
                try {
                  await showTitleBar();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="hideTrafficLights"
              onPress={async () => {
                try {
                  await hideTrafficLights();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="showTrafficLights"
              onPress={async () => {
                try {
                  await showTrafficLights();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="Animate tl position 20"
              onPress={async () => {
                try {
                  animateTrafficLightsPositionTo(0, 20, 0.2);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
            <Button
              title="Animate tl position 0"
              onPress={async () => {
                try {
                  animateTrafficLightsPositionTo(0, 0, 0.2);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 10,
    padding: WINDOW_BORDER_SIZE,
    rowGap: WINDOW_BORDER_SIZE,
    zIndex: 3,
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: WINDOW_BORDER_SIZE,
    // backgroundColor: 'green',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: WINDOW_BORDER_SIZE,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    columnGap: WINDOW_BORDER_SIZE,
  },
});
