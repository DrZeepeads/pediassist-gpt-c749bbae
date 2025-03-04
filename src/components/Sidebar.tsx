
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Calculator, 
  BarChart, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  // Handles animation mounting
  useEffect(() => {
    setMounted(true);
    
    // Handle click outside to close sidebar on mobile
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if sidebar is open and click is outside
      if (isOpen && !target.closest('[data-sidebar]') && !target.closest('[data-sidebar-trigger]')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
    { path: '/calculator', label: 'Drug Calculator', icon: Calculator },
    { path: '/charts', label: 'Growth Charts', icon: BarChart },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          style={{ opacity: mounted ? 1 : 0 }}
        />
      )}
      
      {/* Sidebar */}
      <div
        data-sidebar
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-nelson-600 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-medium text-lg">Nelson-GPT</span>
            </div>
            <button 
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-nelson-50 text-nelson-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-nelson-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t text-center">
            <p className="text-xs text-gray-500">
              For educational purposes only.<br />
              Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
