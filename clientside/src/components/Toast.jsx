import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm";
    const animationStyles = `transform transition-all duration-300 ${
      isRemoving 
        ? 'translate-x-full opacity-0' 
        : isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
    }`;

    switch (toast.type) {
      case 'success':
        return `${baseStyles} ${animationStyles} bg-green-50 border-green-400 text-green-800`;
      case 'error':
        return `${baseStyles} ${animationStyles} bg-red-50 border-red-400 text-red-800`;
      case 'warning':
        return `${baseStyles} ${animationStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'info':
        return `${baseStyles} ${animationStyles} bg-blue-50 border-blue-400 text-blue-800`;
      default:
        return `${baseStyles} ${animationStyles} bg-gray-50 border-gray-400 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="ml-3 flex-1">
        {toast.title && (
          <p className="font-semibold text-sm">{toast.title}</p>
        )}
        <p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={handleRemove}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
