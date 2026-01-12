// Authentication utility functions
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setUserData = (name: string, email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
  }
};

export const getUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail')
    };
  }
  return { name: null, email: null };
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
