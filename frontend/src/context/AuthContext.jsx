import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveAuth = (data, fallbackEmail = '') => {
    const accessToken = data?.access_token;

    if (!accessToken) {
      throw new Error('No access token received from backend');
    }

    const loggedInUser =
      data?.user || {
        email: fallbackEmail,
        role: 'user',
      };

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    setToken(accessToken);
    setUser(loggedInUser);

    return data;
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', {
      email,
      password,
    });

    return saveAuth(res.data, email);
  };

  const register = async (data) => {
    await api.post('/api/auth/register', data);

    const loginRes = await api.post('/api/auth/login', {
      email: data.email,
      password: data.password,
    });

    return saveAuth(loginRes.data, data.email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) return null;

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      return parsedUser;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);