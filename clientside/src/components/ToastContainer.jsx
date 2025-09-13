import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemoveToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
