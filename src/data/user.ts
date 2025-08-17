import { observable, syncState } from '@legendapp/state';
import { syncPlugin } from './sync/sync-pluggin';
import type { User } from '../../types/user';
import type { ObservableSyncState } from '@legendapp/state';

const CURRENT_USER_TYPE_VERSION = 1;

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
  /**
   * Creates a new user and adds them to the registry.
   */
  createUser: (name: string) => User;
}

const allUsers$ = observable<Record<UserId, User>>(
  syncPlugin({
    initial: {},
  }),
);

const usersSyncState$ = syncState(allUsers$);
const usersCount$ = observable(() => {
  return Object.keys(allUsers$.get(true)).length;
});

export const users$ = observable<UserRegistry>({
  all: allUsers$,
  count: usersCount$,
  syncState: usersSyncState$,
  hasAnyUser: () => {
    return usersSyncState$.isPersistLoaded.get() && usersCount$.get() > 0;
  },
  createUser: (name: string) => {
    const now = Date.now();
    const newUser: User = {
      id: now,
      name,
      ' createdAt': now,
      ' updatedAt': now,
      ' version': CURRENT_USER_TYPE_VERSION,
    };
    allUsers$[newUser.id].set(newUser);
    return newUser;
  },
});
