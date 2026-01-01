import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';

const generateId = () => Date.now();

const deletedUsersSubscribers = new Set<(userId: number) => void>();

export function subscribeToDeletedUsers(fn: (userId: number) => void) {
  deletedUsersSubscribers.add(fn);
  return () => {
    deletedUsersSubscribers.delete(fn);
  };
}

const notifyUserDeleted = (userId: number) => {
  deletedUsersSubscribers.forEach(fn => fn(userId));
};

export const users$ = observable(
  syncedCrud({
    list: async () => {
      return [] as {
        id: number;
        lastActiveAt: number;
      }[];
    },
    create: async (user: { id: number; lastActiveAt: number }) => {
      console.log('----Creating user', user);
      // const id = (user as any).id as number;
      // if (!id) {
      //   console.error('User ID is required');
      //   throw new Error('User ID is required');
      // }
      return user;
    },
    delete: async (user: { id: number; lastActiveAt: number }) => {
      console.log('----Deleting user', user);
      notifyUserDeleted(user.id);
      return;
    },
    initial: [],
    as: 'array',
  }),
);

export function createUser(newUser: { lastActiveAt: number }) {
  return users$.push({
    ...newUser,
    id: generateId(),
  });
}

export const usersData$ = observable({
  list: users$,
  hasAnyUser: () => users$.length > 0,
  count: () => users$.get(true).length,
});
