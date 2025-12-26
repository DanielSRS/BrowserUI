import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';

interface Workspace {
  id: number;
  userId: number;
  /**
   * The type of workspace:
   * 0: Automatically created (new window/session)
   * 1: User created
   * 2: Automatically created in icognito mode
   */
  type: 0 | 1 | 2;
}

export const userWorkspacesMap$ = observable(
  syncedCrud({
    list: async () => {
      return [] as { id: number; workspaces: number[] }[];
    },
    create: async data => {
      console.log('----Creating user workspaces map', data);
      return data;
    },
    delete: async data => {
      console.log('----Deleting user workspaces map', data);
      return;
    },
    update: async data => {
      console.log('----Updating user workspaces map', data);
      return data;
    },
    initial: {},
  }),
);

export const workspaces$ = observable<Workspace[]>(
  syncedCrud({
    list: async () => {
      return [] as Workspace[];
    },
    create: async (workspace: Workspace) => {
      console.log('----Creating workspace', workspace);
      const userWorkspaces = userWorkspacesMap$[workspace.userId];
      if (userWorkspaces.peek()) {
        userWorkspaces.workspaces.push(workspace.id);
      } else {
        userWorkspacesMap$[workspace.userId].set({
          id: workspace.userId,
          workspaces: [workspace.id],
        });
      }
      return workspace;
    },
    delete: async data => {
      console.log('----Deleting workspace', data);
      const userWorkspaces = userWorkspacesMap$[data.userId];
      if (userWorkspaces.peek()) {
        userWorkspaces.workspaces.find(wid => wid.peek() === data.id)?.delete();
      } else {
        console.error(
          'User workspaces not found for user. this should never happen',
          data.userId,
        );
      }
      return;
    },
    update: async data => {
      console.log('----Updating workspace', data);
      return data;
    },
    as: 'array',
    initial: [],
    // generateId: () => Date.now(),
  }),
);

export function createWorkspace(userID: number, type: 0 | 1 | 2): Workspace {
  const newWorkspace = {
    id: Date.now(),
    userId: userID,
    type,
  };
  workspaces$.push(newWorkspace);
  return newWorkspace;
}
