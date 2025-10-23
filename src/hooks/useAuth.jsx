import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      console.log('useAuth - userString from localStorage:', userString);
      
      if (userString) {
        const userData = JSON.parse(userString);
        console.log('useAuth - parsed user data:', userData);
        setUser(userData);
      } else {
        console.log('useAuth - No user in localStorage');
      }
    } catch (error) {
      console.error('useAuth - Error parsing user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, logout };
}