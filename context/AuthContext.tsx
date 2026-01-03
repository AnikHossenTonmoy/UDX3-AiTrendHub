
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (action: () => void) => void;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('udx3_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Session recovery failed");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API Call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'Admin' : 'User',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
          savedTools: [],
          savedPrompts: []
        };
        setUser(mockUser);
        localStorage.setItem('udx3_user_session', JSON.stringify(mockUser));
        
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        setIsAuthModalOpen(false);
        resolve(true);
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u-' + Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
          role: 'User',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          savedTools: [],
          savedPrompts: []
        };
        setUser(mockUser);
        localStorage.setItem('udx3_user_session', JSON.stringify(mockUser));
        
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        setIsAuthModalOpen(false);
        resolve(true);
      }, 1200);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('udx3_user_session');
  };

  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, requireAuth, isAuthModalOpen, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
