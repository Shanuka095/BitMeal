import React, { createContext, useContext } from 'react';

// Create the Modal Context
const ModalContext = createContext();

// Custom hook to use the modal context
export const useModal = () => {
  return useContext(ModalContext);
};

// Modal Provider component (will be used in App.jsx)
export const ModalProvider = ({ children, showAlert, showConfirm, showPrompt }) => {
  const value = {
    showAlert,
    showConfirm,
    showPrompt,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
