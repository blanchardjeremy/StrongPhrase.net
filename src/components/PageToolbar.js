import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import SpinButton from './SpinButton';

const PageToolbar = ({
  onGenerate,
  generateButtonText,
  children,
  isSticky = false,
  className = '',
  modalTitle = 'Options',
  hideButton = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasChildren = React.Children.count(children) > 0;

  const mobileButton = hasChildren && (
    <div className="md:hidden">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-sm rounded-lg px-3 py-1.5 bg-white border flex items-center gap-2"
        aria-label="Show options"
      >
        <FaCog className="text-base" />
        <span className="text-sm">Options</span>
      </button>
    </div>
  );

  const mobileModal = isModalOpen && hasChildren && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsModalOpen(false);
        }
      }}
    >
      <div className="bg-white p-4 rounded-lg w-[90vw] max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{modalTitle}</h3>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-6">
          {children}
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full mt-4 btn btn-primary text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const desktopContent = (
    <div className="hidden md:flex md:flex-row gap-3 items-start md:items-end">
      {children}
    </div>
  );

  const containerClasses = `
    flex flex-row gap-3 items-start justify-start
    ${isSticky ? 'sticky top-0 py-4 bg-white z-10' : 'mb-3'}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {!hideButton && <SpinButton onClick={onGenerate}>{generateButtonText}</SpinButton>}
      {mobileButton}
      {mobileModal}
      {desktopContent}
    </div>
  );
};

export default PageToolbar; 