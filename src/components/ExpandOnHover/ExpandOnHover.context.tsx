import { createContext } from 'react';

export const ExpandOnHoverContext = createContext({
  onInnerFocus: () => {},
  onInnerBlur: () => {},
});
