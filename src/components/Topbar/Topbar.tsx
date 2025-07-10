import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native';
import { Menu, useColors } from '@danielsrs/react-native-sdk';
import { ExpandOnHoverContext } from '../ExpandOnHover/ExpandOnHover.context';
import { TopBarButton } from './components/TopbarButton';
import { settings, workspace, type Tab } from '../../store/store';
import {
  Computed,
  Memo,
  observer,
  useObserveEffect,
} from '@legendapp/state/react';
import { WindowButtons } from './components/WindowButtons';
import {
  Window20Regular,
  DocumentSearch20Regular,
  StarLineHorizontal320Regular,
  TabDesktopNewPage20Regular,
  WindowInprivateAccount20Regular,
  History20Regular,
  ArrowDownload20Regular,
  PuzzlePiece20Regular,
  WrenchScrewdriver20Regular,
  Settings20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular,
  MoreHorizontal20Regular,
  Person20Regular,
  AppGeneric20Regular,
} from '../fluent-icons/fluent-icons';
import type { Fluenticon } from '../fluent-icons/fluent-icons-base';

const IS_MACOS = Platform.OS === 'macos';
const WINDOW_CONTROL_AREA_LEFT = IS_MACOS ? 64 : 0;
const WINDOW_CONTROL_AREA_RIGHT = IS_MACOS ? 0 : 128;
const BUTTON_GAP = 4;

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
export const Topbar = observer((props: TopbarProps) => {
  const {} = props;
  const urlInputRef = useRef<string | undefined>(undefined);
  const pageUrlInputRef = useRef<TextInput>(null);
  const { onInnerBlur, onInnerFocus } = useContext(ExpandOnHoverContext);
  const colors = useColors();

  useObserveEffect(() => {
    const cuurrentTabId = workspace.selectedTabId.get();
    const navigationURLChange =
      workspace.tabs[cuurrentTabId].navigationURLChange.get();
    if (!navigationURLChange) {
      return;
    }
    pageUrlInputRef.current?.setNativeProps({
      text: navigationURLChange,
    });
    urlInputRef.current = navigationURLChange;
  });

  const withTextColor = useMemo(
    () => withColor(colors.textPrimary.toString()),
    [colors.textPrimary],
  );

  const openSettings = useCallback(() => {
    workspace.focusConfigTab() ? undefined : workspace.openNewConfigTab();
  }, []);

  return (
    <View style={styles.container}>
      <Memo>
        {IS_MACOS && settings.isTopBarExpanded.get() && <WindowButtons />}
      </Memo>
      <View style={styles.contentArea}>
        <View style={styles.buttonsContainer}>
          {/* Voltar */}
          <Memo>
            {() => {
              const cuurrentTabId = workspace.selectedTabId.get();
              const currentTab = workspace.tabs[cuurrentTabId];
              const tabState = currentTab.state.get();
              const actions = currentTab.actions.get() as Tab['actions'];
              return (
                <TopBarButton
                  disabled={!tabState.canGoBack}
                  onPress={() => {
                    if (actions) {
                      actions.goBack?.();
                    }
                  }}>
                  {ArrowLeft20Regular}
                </TopBarButton>
              );
            }}
          </Memo>
          {/* Avançar */}

          <Memo>
            {() => {
              const cuurrentTabId = workspace.selectedTabId.get();
              const currentTab = workspace.tabs[cuurrentTabId];
              const tabState = currentTab.state.get();
              const actions = currentTab.actions.get() as Tab['actions'];
              return (
                <TopBarButton
                  disabled={!tabState.canGoForward}
                  onPress={() => {
                    if (actions) {
                      actions.goForward?.();
                    }
                  }}>
                  {ArrowRight20Regular}
                </TopBarButton>
              );
            }}
          </Memo>
        </View>
        {}
        <View style={styles.spacer} />
        <View style={styles.urlContainer}>
          <View style={styles.url}>
            <Computed>
              {() => {
                const cuurrentTabId = workspace.selectedTabId.get();
                const currentTab = workspace.tabs[cuurrentTabId];
                const uurl = currentTab.state.url.get() || '';
                const url = currentTab.navigationURLChange.get() || uurl;
                const isNewTab = url === 'browser://newTab';
                return (
                  <TextInput
                    ref={pageUrlInputRef}
                    placeholderTextColor={colors.fillColorTextSecondary}
                    selectTextOnFocus={true}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    style={[
                      styles.urlInput,
                      {
                        backgroundColor: colors.fillColorControlDefault,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: colors.strokeColorSurfaceStrokeDefault,
                      },
                    ]}
                    onChangeText={text => {
                      urlInputRef.current = text;
                    }}
                    // value={url}
                    defaultValue={isNewTab ? '' : url}
                    onSubmitEditing={() => {
                      const _url = urlInputRef.current || '';
                      const withProtocol = _url.startsWith('https://')
                        ? _url
                        : `https://${_url}`;
                      console.log('Submit URL:', withProtocol);
                      const isValid = isValidUrl(withProtocol);
                      if (!isValid) {
                        console.warn('Invalid URL:', withProtocol);
                        return;
                      }
                      currentTab.state.url.set(withProtocol);
                    }}
                    placeholder={'Search or enter web address'}
                    // @ts-expect-error Exits only on Macos
                    enableFocusRing={false}
                    onFocus={() => {
                      // select all text
                      setTimeout(() => {
                        console.log('Focus on URL input');
                        pageUrlInputRef.current?.setNativeProps({
                          selection: {
                            start: 0,
                            end: urlInputRef.current?.length || 0,
                          },
                        });
                      }, 200);
                      // Notify the context that the input is focused
                      onInnerFocus();
                    }}
                    onBlur={onInnerBlur}
                  />
                );
              }}
            </Computed>
          </View>
        </View>
        <View style={styles.spacer} />
        {}
        <View style={styles.buttonsContainer}>
          {/* Perfil */}
          <TopBarButton>{Person20Regular}</TopBarButton>
          {/* Menu */}
          <Menu
            minWidth={250}
            target={<TopBarButton>{MoreHorizontal20Regular}</TopBarButton>}>
            <Menu.MenuEntry
              onPress={workspace.openNewTab}
              left={withTextColor(TabDesktopNewPage20Regular)}>
              New Tab
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(Window20Regular)}>
              New Window
            </Menu.MenuEntry>
            <Menu.MenuEntry
              left={withTextColor(WindowInprivateAccount20Regular)}>
              New InPrivate Window
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(StarLineHorizontal320Regular)}>
              Favorites
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(History20Regular)}>
              History
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(ArrowDownload20Regular)}>
              Downloads
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(PuzzlePiece20Regular)}>
              Extensions
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(DocumentSearch20Regular)}>
              Find on page
            </Menu.MenuEntry>
            <Menu.MenuEntry left={withTextColor(WrenchScrewdriver20Regular)}>
              More Tools
            </Menu.MenuEntry>
            <Menu.MenuEntry
              left={withTextColor(AppGeneric20Regular)}
              onPress={workspace.openUrl}>
              Showcase
            </Menu.MenuEntry>
            <Menu.MenuEntry
              left={withTextColor(Settings20Regular)}
              onPress={openSettings}>
              Settings
            </Menu.MenuEntry>
          </Menu>
        </View>
      </View>
      {}
    </View>
  );
});

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!url.startsWith('https://')) {
      console.warn('Invalid URL protocol:', url);
      return false;
    }
    // console.log('Valid URL:', u);
    return !!u;
  } catch (e) {
    console.warn('Invalid URL:', e);
    return false;
  }
}

const withColor = (color: string) => (Icon: Fluenticon) => {
  return <Icon color={color} />;
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
    paddingHorizontal: 16,
    paddingVertical: 0,
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
    paddingHorizontal: 8,
    // borderWidth: 1,
    width: '100%',
    borderColor: 'red',
    alignItems: 'center',
    // paddingVertical: 4,
  },
  urlInput: {
    paddingVertical: 6,
    // backgroundColor: '#00000040',
    paddingHorizontal: 32,
    borderRadius: 24,
    borderCurve: 'continuous',
    width: '100%',
    maxWidth: 600,
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
});
