import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="w-full p-4 md:p-6 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 flex items-center">
      <button onClick={onMenuClick} className="text-gray-300 hover:text-white transition-colors">
          <MenuIcon className="w-6 h-6 md:w-7 md:h-7" />
      </button>
    </header>
  );
};

export default Header;