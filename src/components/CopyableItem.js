import React, { useState } from 'react';
import { FaRegCopy, FaCheck, FaInfoCircle } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Toast from './Toast';
import { cn } from './utils';

const CopyableItem = ({ 
  content,                    // The main content to display and copy
  label,                     // The label text
  stats = [],               // Array of stats to show [{label: string, value: string}]
  showInfoIcon = true,      // Whether to show the info icon
  infoBits = null,          // The bits of entropy to show in tooltip
  copyToClipboard,          // Function to call when copying
  copiedId,                // The ID that was copied (to show copy state)
  itemId,                  // The ID of this item
  generationCount,         // Used for animation key
  hideWhenOthersCopied = false,  // Whether to hide when other items are copied
  showHidden = true,       // Whether to show hidden items
  className = "",          // Additional classes for the block
  renderContentOnly = true, // Whether to render the plain content
  showLabel = true,        // Whether to show the label section
  noMarginBottom = false,  // Whether to remove bottom margin
  children                 // Optional additional content
}) => {
  const [showToast, setShowToast] = useState(false);
  const isHidden = hideWhenOthersCopied && copiedId && copiedId !== itemId && !showHidden;

  const handleCopy = () => {
    copyToClipboard(content, itemId);
    setShowToast(true);
  };

  const isCopied = copiedId === itemId;

  return (
    <>
      <div 
        className={`passphrase-block group ${
          isCopied ? 'copied' : ''
        } ${isHidden ? 'hide' : ''} ${className}`}
      >
        {showLabel && (
          <label className="block mb-1 tracking-wide">
            <div className="flex flex-col md:flex-row md:items-center space-x-3">
              <div className="label-container">
                <span className={`font-bold text-md uppercase text-gray-500 inline-block ${label}`}>{label}</span>
                {showInfoIcon && infoBits && (
                  <span className="ml-2 group">
                    <div className="tooltip mt-1" data-tip={`${infoBits} bits of entropy`}>
                      <FaInfoCircle className="text-gray-500 cursor-pointer text-base" />
                    </div>
                  </span>
                )}
              </div>
              {stats.length > 0 && (
                <div className="text-gray-500 italic text-sm mt-1 md:mt-0">
                  {stats.map(({ label, value }, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="mx-2">•</span>}
                      <span>{value} {label}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </label>
        )}
        <div className={`relative passphrase-content ${!noMarginBottom && 'mb-6'}`} onClick={handleCopy}>
          <div className="relative">
            <TransitionGroup component={null}>
              <CSSTransition
                key={`${itemId}-${generationCount}`}
                timeout={300}
                classNames="username-text"
              >
                <div className="absolute inset-0">
                  {renderContentOnly && content}
                  {children}
                </div>
              </CSSTransition>
            </TransitionGroup>
            <div className="invisible">
              {renderContentOnly && content}
              {children}
            </div>
          </div>

          <span className={cn(
            'absolute right-2 top-1/2 transform -translate-y-1/2 items-center justify-end',
            'flex md:hidden',
            'md:group-hover:flex',
            isCopied && 'md:flex'
          )}>
            {isCopied ? <FaCheck className="w-5 h-5" /> : <FaRegCopy className="w-5 h-5" />}
            
          </span>
        </div>
      </div>

      <Toast 
        message="Copied to clipboard!"
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </>
  );
};

export default CopyableItem; 