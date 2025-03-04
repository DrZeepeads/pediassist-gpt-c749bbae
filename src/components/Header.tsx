
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  
  // Determine the current section based on the URL path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/chat') return 'AI Assistant';
    if (path === '/calculator') return 'Drug Calculator';
    if (path === '/charts') return 'Growth Charts';
    
    // Default fallback or transform the path
    return path.split('/').pop()?.replace('-', ' ') || 'Nelson-GPT';
  };
  
  return (
    <header className="sticky top-0 z-30 w-full glass-panel flex items-center justify-between px-4 h-16 border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-medium text-gray-800">{getCurrentSection()}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium text-nelson-600 px-2 py-1 rounded-full bg-nelson-50 border border-nelson-100">
          Nelson Textbook of Pediatrics
        </div>
      </div>
    </header>
  );
};

export default Header;
