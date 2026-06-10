import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state by hitting the refresh endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/refresh` : 'http://localhost:5001/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });

        if (res.ok) {
          // Token is valid, restore user from local storage
          const savedAuth = localStorage.getItem('epmoc_auth');
          if (savedAuth) {
            const parsed = JSON.parse(savedAuth);
            setIsAuthenticated(parsed.isAuthenticated);
            setUser(parsed.user);
            setRole(parsed.role);
          }
        } else {
          // Token invalid, clear state
          localStorage.removeItem('epmoc_auth');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem('epmoc_auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/login` : 'http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setIsAuthenticated(true);
      setUser(data);
      setRole(data.role);

      // Persist lightweight state
      localStorage.setItem('epmoc_auth', JSON.stringify({
        isAuthenticated: true,
        user: data,
        role: data.role
      }));

      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (email, password, role = 'participant', extendedData = {}) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/register` : 'http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, ...extendedData }),
        credentials: 'include' 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/logout` : 'http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include' 
      });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      localStorage.removeItem('epmoc_auth');
    }
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
