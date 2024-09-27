import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {
  multiply,
  hideTitleBar,
  hideTrafficLights,
  showTitleBar,
  showTrafficLights,
  animateTrafficLightsPositionTo,
} from 'react-native-infinity';

function App(): React.JSX.Element {
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          borderWidth: 1,
          paddingVertical: 4,
          backgroundColor: 'green',
        }}
        onPress={() => {
          console.log('Touchhing ttitlebar area');
        }}>
        <Text>Value</Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
  );
}

export default App;
