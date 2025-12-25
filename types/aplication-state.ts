export const APP_STATE = {
  /**
   * Indicates that there are no users in the application.
   */
  NO_USERS: 0,
  /**
   * Indicates that the application is in an undefined state.
   */
  UNDEFINED_STATE: 1,
} as const;

/**
 * The application state.
 */
export type ApplicationState = (typeof APP_STATE)[keyof typeof APP_STATE];
