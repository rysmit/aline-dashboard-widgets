import { createContext, useContext, useState, ReactNode } from 'react';
import { Community, mockCommunities } from '@/types/community';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'community_user';
  communityId?: string;
  community?: Community;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = {
  admin: {
    id: '1',
    name: 'Admin User',
    role: 'admin' as const,
  },
  communityUser: {
    id: '2', 
    name: 'Community User',
    role: 'community_user' as const,
    communityId: '1',
    community: mockCommunities.find(c => c.id === '1'),
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Default to admin user for demo to access admin panel
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const value = {
    user,
    setUser,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};