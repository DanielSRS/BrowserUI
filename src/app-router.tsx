import { useObservable, Switch } from '@legendapp/state/react';
import { users$ } from './data/user';
import { UserCreation } from './Pages/user-creation/user-creation';
import { UndefinedStatePage } from './Pages/undefined-state/undefined-state';
import { APP_STATE, type ApplicationState } from '../types/aplication-state';

/**
 * The application router.
 *
 * It renders the apropriate views based on the current
 * state of the application.
 */
export function AppRouter() {
  const currentState$ = useObservable<ApplicationState>(() => {
    if (users$.count.get()) {
      return APP_STATE.NO_USERS;
    }
    return APP_STATE.UNDEFINED_STATE;
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
