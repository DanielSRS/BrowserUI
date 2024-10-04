import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewProps,
} from 'react-native';

const LINKING_ERROR =
  "The package 'blurview' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

interface BlurViewProps extends ViewProps {
  //
}

const ComponentName = 'BlurView';

export const BlurView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<BlurViewProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
