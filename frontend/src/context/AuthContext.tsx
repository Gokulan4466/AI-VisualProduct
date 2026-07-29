import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  googleLogin: () => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return {
      id: 'usr-virtual-ai',
      name: 'Virtual-AI',
      email: 'virtual-ai@visionsearch.io',
      avatar: ''
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Virtual-AI',
      email,
      avatar: ''
    };
    setUser(newUser);
  };

  const googleLogin = () => {
    const googleUser: User = {
      id: 'usr-google-88',
      name: 'Virtual-AI',
      email: 'virtual-ai@gmail.com',
      avatar: ''
    };
    setUser(googleUser);
  };

  const register = (name: string, email: string) => {
    login(email, name);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
