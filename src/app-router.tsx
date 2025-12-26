import { useObservable, Switch } from '@legendapp/state/react';
import { createUser, users$, usersData$ } from './data/user';
import { UserCreation } from './Pages/user-creation/user-creation';
import { UndefinedStatePage } from './Pages/undefined-state/undefined-state';
import { APP_STATE } from '../types/aplication-state';
import { createSession, OpenSessionsData$ } from './data/session';
import type { ComponentProps } from 'react';
import { App } from './AppEntry';

/**
 * The application router.
 *
 * It renders the apropriate views based on the current
 * state of the application.
 */
export function AppRouter() {
  const currentState$ = useObservable(() => {
    if (usersData$.count.get() === 0) {
      return APP_STATE.NO_USERS;
    }
    if (OpenSessionsData$.numberOfSessions.get() === 0) {
      return APP_STATE.NO_SESSIONS_OPEN;
    }
    return APP_STATE.UNDEFINED_STATE;
  });
  const deleteAllUsers = () => {
    usersData$.list.forEach(u => u.delete());
  };
  const onCreateUser = (_: string) => {
    createUser({
      lastActiveAt: Date.now(),
    });
  };
  return (
    <Switch value={currentState$}>
      {{
        1: UserCreationPage(onCreateUser),
        3: undefinedStatePage({
          onRetry: () => {
            const userId = users$[0]?.id.peek();
            if (!userId) {
              console.error('No user found to create session for.');
              return;
            }
            createSession(userId);
          },
          title: 'No sessions are currently open.',
        }),
        2: App,
        default: undefinedStatePage({
          onRetry: deleteAllUsers,
          title: 'This is an undefined ---.',
        }),
      }}
    </Switch>
  );
}

const undefinedStatePage =
  (props: ComponentProps<typeof UndefinedStatePage>) => () => {
    return <UndefinedStatePage {...props} />;
  };

const UserCreationPage = (onUserCreated: (name: string) => void) => () => {
  return <UserCreation onUserCreated={onUserCreated} />;
};
