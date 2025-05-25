import React, { createContext, useContext, useState } from 'react';
import MessageNotify from '../components/MessageNotify';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <MessageNotify message={toast} onClose={hideToast} />}
        </ToastContext.Provider>
    );
}; 