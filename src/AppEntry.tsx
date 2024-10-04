import React from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  multiply,
  hideTitleBar,
  hideTrafficLights,
  showTitleBar,
  showTrafficLights,
  animateTrafficLightsPositionTo,
} from 'react-native-infinity';
import { Topbar } from './Topbar/Topbar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';

const WINDOW_BORDER_SIZE = 6;

export function App() {
  return (
    <View style={styles.window}>
      {/* Nav bar */}
      <ExpandOnHover>
        <Topbar />
      </ExpandOnHover>
      <View style={styles.row}>
        {/* Tabbar */}
        <View style={styles.sideBar}>
          <TouchableOpacity style={styles.btn} />
        </View>
        {/* Content container */}
        <View style={styles.contentArea}>
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
  sideBar: {
    // backgroundColor: 'red',
    borderRadius: WINDOW_BORDER_SIZE,
    overflow: 'hidden',
  },
  btn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: WINDOW_BORDER_SIZE * 0.9,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    columnGap: WINDOW_BORDER_SIZE,
  },
});
