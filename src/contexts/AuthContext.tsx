import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearAllUserData: () => Promise<void>;
  deleteAccount: (password?: string) => Promise<{ success: boolean; requiresReauth: boolean; error?: string }>;
  reauthenticate: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const clearAllUserData = async () => {
    if (!user) throw new Error('No user logged in');
    
    const userId = user.uid;
    
    // Handle collections where document ID IS the userId
    const directDocCollections = ['userData', 'userSettings'];
    for (const collectionName of directDocCollections) {
      try {
        const docRef = doc(db, collectionName, userId);
        await deleteDoc(docRef);
      } catch (error: any) {
        // Ignore "not-found" errors - document may not exist
        if (error.code !== 'not-found') {
          console.warn(`Could not delete ${collectionName}/${userId}:`, error);
        }
      }
    }
    
    // Handle collections where userId is a field in the document
    const queryCollections = ['projects'];
    for (const collectionName of queryCollections) {
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      // Use batch for multiple deletes
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnapshot) => {
          batch.delete(docSnapshot.ref);
        });
        await batch.commit();
      }
    }
    
    // Clear local storage for this user
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('benderIQ') || key.includes('bendiq') || key.includes('projs'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const reauthenticate = async (password: string) => {
    if (!user || !user.email) throw new Error('No user logged in');
    
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const deleteAccount = async (password?: string): Promise<{ success: boolean; requiresReauth: boolean; error?: string }> => {
    if (!user) return { success: false, requiresReauth: false, error: 'No user logged in' };
    
    try {
      // First clear all user data from Firestore
      await clearAllUserData();
      
      // Then delete the auth account
      await user.delete();
      
      // Sign out (cleanup)
      await signOut(auth);
      
      return { success: true, requiresReauth: false };
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        // User needs to re-authenticate
        if (password && user.email) {
          try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            
            // Try again after re-auth
            await clearAllUserData();
            await user.delete();
            await signOut(auth);
            
            return { success: true, requiresReauth: false };
          } catch (reauthError: any) {
            return { success: false, requiresReauth: true, error: reauthError.message };
          }
        }
        return { success: false, requiresReauth: true, error: 'Please re-enter your password to confirm deletion' };
      }
      
      // For Google users, try re-auth with popup
      if (error.code === 'auth/requires-recent-login' && user.providerData[0]?.providerId === 'google.com') {
        try {
          await reauthenticateWithPopup(user, googleProvider);
          await clearAllUserData();
          await user.delete();
          await signOut(auth);
          return { success: true, requiresReauth: false };
        } catch (popupError: any) {
          return { success: false, requiresReauth: true, error: popupError.message };
        }
      }
      
      return { success: false, requiresReauth: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    clearAllUserData,
    deleteAccount,
    reauthenticate
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
