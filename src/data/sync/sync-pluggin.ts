import { configureSynced } from '@legendapp/state/sync';
//import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';

/**
 * Shared persistence configuration for the application.
 */
export const syncPlugin = configureSynced({
  persist: {
    //plugin: ObservablePersistAsyncStorage,
  },
});
