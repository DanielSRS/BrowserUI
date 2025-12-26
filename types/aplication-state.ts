export const APP_STATE = {
  /**
   * Indicates that there are no users in the application.
   */
  NO_USERS: 1,
  /**
   * Indicates that the application is in an undefined state.
   */
  UNDEFINED_STATE: 2,
  NO_SESSIONS_OPEN: 3,
} as const;

/**
 * The application state.
 */
export type ApplicationState = (typeof APP_STATE)[keyof typeof APP_STATE];
