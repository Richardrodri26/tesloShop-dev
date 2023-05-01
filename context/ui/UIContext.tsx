import { createContext } from 'react';

interface ContextProps {
  isMenuOpen: boolean;

  //methods
  toggleSideMenu: () => void
}

export const UIContext = createContext({} as ContextProps)