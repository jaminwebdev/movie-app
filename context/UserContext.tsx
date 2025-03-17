import { createContext, useContext } from 'react';

type UserContextType = {
  userId: string | null;
  setUserId: (id: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 