
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon, HomeIcon, FileTextIcon, HistoryIcon, XIcon, UserIcon } from './Icons';

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    isCollapsed: boolean;
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, isCollapsed, children, isActive, onClick }) => {
    const handleClick = () => {
        window.location.hash = href;
        onClick();
    };

    const iconVariants = {
        collapsed: { scale: 1.1, x: 3 },
        expanded: { scale: 1, x: 0 },
    };

    const textVariants = {
        collapsed: { opacity: 0, x: -10, width: 0, marginLeft: 0 },
        expanded: { opacity: 1, x: 0, width: 'auto', marginLeft: '1rem' },
    }

    return (
        <button
            onClick={handleClick}
            title={isCollapsed ? String(children) : ''}
            className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-indigo-600/80 text-white' 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
        >
            <motion.div
                variants={iconVariants}
                animate={isCollapsed ? "collapsed" : "expanded"}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {icon}
            </motion.div>
            <motion.span 
                initial={false}
                variants={textVariants}
                animate={isCollapsed ? "collapsed" : "expanded"}
                transition={{ type: 'spring', stiffness: 250, damping: 25, delay: isCollapsed ? 0 : 0.05 }}
                className="font-semibold whitespace-nowrap overflow-hidden"
            >
                {children}
            </motion.span>
        </button>
    );
};

interface SidebarProps {
  isCollapsed: boolean;
  currentRoute: string;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContent: React.FC<{ isCollapsed: boolean, currentRoute: string, onLinkClick: () => void }> = ({ isCollapsed, currentRoute, onLinkClick }) => (
    <>
        <div className="flex items-center mb-10 pl-1">
            <LogoIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <motion.h1 
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
                className="ml-3 text-2xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden"
            >
                LexiGuard <span className="text-indigo-400">AI</span>
            </motion.h1>
        </div>
        <nav className="flex-grow flex flex-col">
            <NavLink href="#/" icon={<HomeIcon className="w-6 h-6 flex-shrink-0" />} isCollapsed={isCollapsed} isActive={currentRoute === '#/'} onClick={onLinkClick}>Home</NavLink>
            <NavLink href="#/analyze" icon={<FileTextIcon className="w-6 h-6 flex-shrink-0" />} isCollapsed={isCollapsed} isActive={currentRoute === '#/analyze'} onClick={onLinkClick}>Analyze Document</NavLink>
            <NavLink href="#/history" icon={<HistoryIcon className="w-6 h-6 flex-shrink-0" />} isCollapsed={isCollapsed} isActive={currentRoute === '#/history'} onClick={onLinkClick}>Document History</NavLink>
            <NavLink href="#/profile" icon={<UserIcon className="w-6 h-6 flex-shrink-0" />} isCollapsed={isCollapsed} isActive={currentRoute === '#/profile'} onClick={onLinkClick}>Profile</NavLink>
        </nav>
    </>
);


export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, currentRoute, isMobile, isOpen, onClose }) => {
  if (isMobile) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose} 
                        className="fixed inset-0 bg-black/60 z-30" 
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-72 bg-gray-800 shadow-2xl z-40 p-4 flex flex-col border-r border-gray-700"
                    >
                         <button onClick={onClose} className="self-start text-gray-400 hover:text-white mb-4">
                            <XIcon className="w-6 h-6" />
                         </button>
                        <SidebarContent isCollapsed={false} currentRoute={currentRoute} onLinkClick={onClose} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
  }

  return (
    <motion.div
        animate={{ width: isCollapsed ? '5rem' : '18rem' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full bg-gray-800 shadow-2xl z-30 p-4 flex flex-col border-r border-gray-700"
    >
        <SidebarContent isCollapsed={isCollapsed} currentRoute={currentRoute} onLinkClick={() => {}} />
    </motion.div>
  );
};
