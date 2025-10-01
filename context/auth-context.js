import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        console.log('User is signed in:', user.email);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    // Login logic
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: res.user };
    } catch (error) {
      let msg = error.message;
      return { success: false, error: msg };
    }
  };
  const logout = async () => {
    // Logout logic
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      let msg = error.message;

      return { success: false, error: msg };
    }
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
