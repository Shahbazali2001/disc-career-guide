import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../api/axiosClient.js';
import { getMe, loginUser, registerUser, updateCareerProfile } from '../api/careerApi.js';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        const data = await getMe();
        if (active && data?.user) {
          setUser(data.user);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        }
      } catch {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    hydrate();

    const handleUnauthorized = () => {
      clearSession();
    };
    window.addEventListener('disc:unauthorized', handleUnauthorized);

    return () => {
      active = false;
      window.removeEventListener('disc:unauthorized', handleUnauthorized);
    };
  }, [clearSession]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginUser({ email, password });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await registerUser({ name, email, password });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession]
  );

  const saveCareerProfile = useCallback(async (profilePayload) => {
    const data = await updateCareerProfile(profilePayload);
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const hasCareerProfile = Boolean(
    user?.hasCareerProfile ||
      (user?.careerProfile?.educationLevel &&
        user?.careerProfile?.fieldOfStudy &&
        typeof user?.careerProfile?.yearsOfExperience === 'number' &&
        typeof user?.careerProfile?.age === 'number')
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      hasCareerProfile,
      login,
      register,
      saveCareerProfile,
      logout,
    }),
    [user, token, isLoading, hasCareerProfile, login, register, saveCareerProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
