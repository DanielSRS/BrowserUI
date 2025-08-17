/**
 * Indicates that there are no users in the application.
 */
export type NoUsers = 0;

/**
 * Indicates that the application is in an undefined state.
 */
export type UndefinedState = 1;

/**
 * The application state.
 */
export type ApplicationState = NoUsers | UndefinedState;
