import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Topbar } from './components/Topbar/Topbar';
import { Tabbar } from './components/Tabbar/Tabbar';
import { ExpandOnHover } from './components/ExpandOnHover/ExpandOnHover';
import { useColors } from 'react-native-sdk';
import { WINDOW_BORDER_SIZE } from './constraints/layout';

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
            {}
            {}
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
    borderRadius: WINDOW_BORDER_SIZE,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    columnGap: WINDOW_BORDER_SIZE,
  },
});
