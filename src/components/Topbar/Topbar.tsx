import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native';
import { useColors } from 'react-native-sdk';
import { ExpandOnHoverContext } from '../ExpandOnHover/ExpandOnHover.context';
import { TopBarButton } from './components/TopbarButton';
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  MoreHorizontalRegular,
  PersonRegular,
} from './components/icons';

const WINDOW_CONTROL_AREA_LEFT = 55;
const WINDOW_CONTROL_AREA_RIGHT = 55;
const BUTTON_GAP = 10;

interface TopbarProps {
  //
}

/**
 * Exibe a barra superior no navegador.
 *
 * Nela estõa contidos:
 *  - URL bar
 *  - Navigation controls (back, foward, reload)
 *  - Browser menu
 *  - Profile icon
 */
export const Topbar = (props: TopbarProps) => {
  const {} = props;
  const { onInnerBlur, onInnerFocus } = useContext(ExpandOnHoverContext);
  const colors = useColors();

  return (
    <View style={styles.container}>
      {}
      <View style={styles.contentArea}>
        <View style={styles.buttonsContainer}>
          {/* Voltar */}
          <TopBarButton>{ArrowLeftRegular}</TopBarButton>
          {/* Avançar */}
          <TopBarButton>{ArrowRightRegular}</TopBarButton>
        </View>
        {}
        <View style={styles.spacer} />
        <View style={styles.urlContainer}>
          <View style={styles.url}>
            <TextInput
              placeholderTextColor={colors.fillColorTextSecondary}
              style={[
                styles.urlInput,
                {
                  backgroundColor: colors.backgroundFillColorLayerDefault,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.strokeColorCardStrokeDefault,
                },
              ]}
              placeholder={'about:work-in-progress'}
              // @ts-expect-error Exits only on Macos
              enableFocusRing={false}
              onFocus={onInnerFocus}
              onBlur={onInnerBlur}
            />
          </View>
        </View>
        <View style={styles.spacer} />
        {}
        <View style={styles.buttonsContainer}>
          {/* Menu */}
          <TopBarButton>{MoreHorizontalRegular}</TopBarButton>
          {/* Perfil */}
          <TopBarButton>{PersonRegular}</TopBarButton>
        </View>
      </View>
      {}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: WINDOW_CONTROL_AREA_LEFT,
    paddingRight: WINDOW_CONTROL_AREA_RIGHT,
    // backgroundColor: 'purple',
    width: '100%',
  },
  contentArea: {
    // borderWidth: 2,
    borderColor: 'blue',
    flexDirection: 'row',
  },
  buttonsContainer: {
    paddingHorizontal: BUTTON_GAP,
    paddingVertical: 2,
    // backgroundColor: 'green',
    flexDirection: 'row',
    columnGap: BUTTON_GAP,
  },
  urlContainer: {
    alignItems: 'center',
    flex: 2,
    // borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  url: {
    paddingHorizontal: 10,
    // borderWidth: 1,
    width: '100%',
    borderColor: 'red',
    alignItems: 'center',
    // paddingVertical: 4,
  },
  urlInput: {
    paddingVertical: 8,
    // backgroundColor: '#00000040',
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    // borderColor: 'red',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  spacer: {
    // flex: 1,
    // borderWidth: 1,
    borderColor: 'pink',
  },
  navbarButton: {
    // borderWidth: 1,
    aspectRatio: 1,
    width: 30,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
  },
});
