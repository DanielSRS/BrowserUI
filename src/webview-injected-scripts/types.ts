export interface WVNavigationEvent {
  type: 'navigation';
  payload: {
    url: string;
    title: string;
    canGoBack: boolean;
    // canGoForward: boolean;
    // loading: boolean;
  };
}

export type WebviewMessageEvent = WVNavigationEvent;
