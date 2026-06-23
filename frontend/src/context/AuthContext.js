import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : { token: null, role: null, user: null };
    } catch (e) {
      return { token: null, role: null, user: null };
    }
  });

  useEffect(() => {
    if (auth && auth.token) {
      localStorage.setItem('auth', JSON.stringify(auth));
      localStorage.setItem('token', auth.token || '');
      if (auth.role) localStorage.setItem('role', auth.role);
    } else {
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [auth]);

  const login = ({ token, role, user }) => setAuth({ token, role, user });
  const logout = () => setAuth({ token: null, role: null, user: null });
  const updateUser = (updatedUser) => {
    setAuth((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedUser } : updatedUser,
    }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
