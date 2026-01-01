import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { createWorkspace, userWorkspacesMap$, workspaces$ } from './workspace';
import { subscribeToDeletedUsers } from './user';

export interface Session {
  /**
   * The session ID but it also represents the workspace ID.
   */
  id: number;
  /**
   * The timestamp when the session was opened.
   */
  openedAt: number;
  /**
   * The timestamp when the session was last focused.
   */
  lastFocusedAt: number;
}

const OpenSessions$ = observable(
  syncedCrud({
    list: async () => {
      return [] as Session[];
    },
    create: async (session: Session) => {
      console.log('----Creating session', session);
      return session;
    },
    delete: async (session: Session) => {
      console.log('----Deleting session', session);
      return;
    },
    initial: {},
  }),
);

export function createSession(userId: number, t: 0 | 1 | 2 = 0): Session {
  const newWorkspace = createWorkspace(userId, t);
  const d: Session = {
    id: newWorkspace.id,
    lastFocusedAt: Date.now(),
    openedAt: Date.now(),
  };
  OpenSessions$[d.id].set(d);
  return d;
}

export const OpenSessionsData$ = observable({
  sessions: OpenSessions$,
  numberOfSessions: () => Object.keys(OpenSessions$.get()).length,
});

// Load
workspaces$.peek();
userWorkspacesMap$.peek();
OpenSessions$.peek();
subscribeToDeletedUsers(userId => {
  const userWorkspaces = userWorkspacesMap$[userId];
  if (userWorkspaces.peek()) {
    userWorkspaces.workspaces.forEach(wid => {
      const workspaceId = wid.peek();
      OpenSessions$[workspaceId].delete();
      userWorkspaces.delete();
    });
  } else {
    console.error(
      'User workspaces not found for user when deleting sessions. this should never happen',
      {
        userId,
        workspaces: workspaces$.peek(),
      },
    );
  }
});
