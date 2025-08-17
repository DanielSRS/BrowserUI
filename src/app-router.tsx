import { useObservable, Switch } from '@legendapp/state/react';
import { users$ } from './data/user';
import { Styled } from '@danielsrs/react-native-sdk';
import { UserCreation } from './Pages/user-creation/user-creation';
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
  return (
    <Switch value={currentState$}>
      {{
        0: UserCreationPage,
        default: UndefinedStatePage,
      }}
    </Switch>
  );
}

function UndefinedStatePage() {
  return <UndefinedView />;
}

function UserCreationPage() {
  return <UserCreation onUserCreated={users$.createUser} />;
}

const UndefinedView = Styled.createStyledView({
  flex: 1,
  backgroundColor: 'red',
  borderWidth: 1,
  borderColor: 'blue',
});
