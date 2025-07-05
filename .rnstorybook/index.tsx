import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from '@danielsrs/react-native-sdk';
import { view } from './storybook.requires';
import { LiteUI } from '@storybook/react-native-ui-lite';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  // @ts-expect-error
  CustomUIComponent: Constants.IS_WINDOWS ? LiteUI : undefined,
});

export default StorybookUIRoot;
