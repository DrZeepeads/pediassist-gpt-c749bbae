
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
  installPrompt?: any;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, installPrompt }) => {
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
  
  // Handle install button click
  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    }
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
        {installPrompt && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInstallClick}
            className="flex items-center gap-1 mr-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Install App</span>
          </Button>
        )}
        <div className="text-sm font-medium text-nelson-600 px-2 py-1 rounded-full bg-nelson-50 border border-nelson-100">
          Nelson Textbook of Pediatrics
        </div>
      </div>
    </header>
  );
};

export default Header;
