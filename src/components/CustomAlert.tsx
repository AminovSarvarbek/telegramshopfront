import React, { useEffect } from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
  autoClose?: boolean;
  autoCloseTime?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  message,
  type,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    let timer: number | undefined;
    
    if (isOpen && autoClose) {
      timer = window.setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isOpen, onClose, autoClose, autoCloseTime]);
  
  if (!isOpen) return null;
  
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slideIn">
      <div className={`p-4 rounded-lg shadow-md border ${bgColor} flex items-start`}>
        <div className={`flex-shrink-0 ${iconColor} mr-3`}>
          {type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomAlert; 