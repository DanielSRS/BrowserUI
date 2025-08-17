import { observable, syncState } from '@legendapp/state';
import { syncPlugin } from './sync/sync-pluggin';
import type { User } from '../../types/user';
import type { ObservableSyncState } from '@legendapp/state';

type UserId = number;

interface UserRegistry {
  /**
   * A record of all users by their unique IDs.
   */
  all: Record<UserId, User>;
  /**
   * The synchronization state of the user registry.
   */
  syncState: ObservableSyncState;
  /**
   * The number of users in the registry.
   */
  count: number;
  /**
   * Whether there are any users in the registry.
   */
  hasAnyUser: boolean;
}

const allUsers$ = observable(
  syncPlugin({
    initial: {},
  }),
);

const usersSyncState$ = syncState(allUsers$);
const usersCount$ = observable(() => {
  return Object.keys(allUsers$.get(true)).length;
});

export const user$ = observable<UserRegistry>({
  all: allUsers$,
  count: usersCount$,
  syncState: usersSyncState$,
  hasAnyUser: () => {
    return usersSyncState$.isPersistLoaded.get() && usersCount$.get() > 0;
  },
});
