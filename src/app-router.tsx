import { useObservable, Switch } from '@legendapp/state/react';
import { users$ } from './data/user';
import { UserCreation } from './Pages/user-creation/user-creation';
import { UndefinedStatePage } from './Pages/undefined-state/undefined-state';
import type { ApplicationState } from '../types/aplication-state';

const NO_USERS: ApplicationState = 0;
const UNDEFINED_STATE: ApplicationState = 1;

/**
 * The application router.
 *
 * It renders the apropriate views based on the current
 * state of the application.
 */
export function AppRouter() {
  const currentState$ = useObservable<ApplicationState>(() => {
    return users$.count.get() === 0 ? NO_USERS : UNDEFINED_STATE;
  });
  const deleteAllUsers = () => {
    users$.all.set({});
  };
  return (
    <Switch value={currentState$}>
      {{
        0: UserCreationPage,
        default: undefinedStatePage(deleteAllUsers),
      }}
    </Switch>
  );
}

const undefinedStatePage = (onRetry: () => void) => () => {
  return <UndefinedStatePage onRetry={onRetry} />;
};

function UserCreationPage() {
  return <UserCreation onUserCreated={users$.createUser} />;
}
