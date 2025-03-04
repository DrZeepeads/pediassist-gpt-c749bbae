
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border border-gray-100">
        <div className="flex space-x-1">
          <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
