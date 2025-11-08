// src/utils/auth.js
export const setAuthToken = (token, rememberMe = false) => {
  if (!token) return;
  if (rememberMe) {
    localStorage.setItem('admin_token', token);
  } else {
    sessionStorage.setItem('admin_token', token);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_token');
};

export const isLoggedIn = () => {
  return !!getAuthToken();
};