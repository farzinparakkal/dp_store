import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = null, duration = 4000) => {
    return addToast({ type: 'success', message, title, duration });
  }, [addToast]);

  const showError = useCallback((message, title = null, duration = 5000) => {
    return addToast({ type: 'error', message, title, duration });
  }, [addToast]);

  const showWarning = useCallback((message, title = null, duration = 4000) => {
    return addToast({ type: 'warning', message, title, duration });
  }, [addToast]);

  const showInfo = useCallback((message, title = null, duration = 4000) => {
    return addToast({ type: 'info', message, title, duration });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
