/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Compare', path: '/' },
    { name: 'Scores', path: '/scores' },
    { name: 'Quality', path: '/quality' },
    { name: 'Batch', path: '/batch' },
    { name: 'Methods', path: '/methods' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full z-[100] flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105 duration-150 group z-[101]"
        >
          <span className="text-[20px] md:text-[24px] font-black text-[#2FFF2F]">旅行</span>
          <span className="text-[14px] md:text-[18px] font-bold text-[#2FFF2F] uppercase tracking-tighter">ryko</span>
        </Link>

        {/* Center: Desktop Links (Hidden on mobile) */}
        <div 
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 border-b-[3px] border-x-[3px] border-black rounded-b-xl px-10 py-3.5 gap-8 shadow-lg transition-colors duration-300"
          style={{ backgroundColor: 'var(--nav-bar-bg)' }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-white text-[14px] font-medium tracking-tight relative group",
                  isActive ? "text-[#D8560E]" : "hover:text-white/80"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-[#D8560E] transition-all duration-200",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            );
          })}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 z-[101]">
          <button
            onClick={toggleTheme}
            className={cn(
              "w-12 h-8 md:w-16 md:h-8 border-2 border-black shadow-[2px_2px_0px_#000000] dark:border-[#F5F5F5] dark:shadow-[2px_2px_0px_#F5F5F5] flex items-center justify-center transition-colors",
              theme === 'light' ? "bg-[#F5F5F5]" : "bg-black"
            )}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-black" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-[#F5F5F5]" />
            )}
          </button>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-12 h-8 bg-black text-white border-2 border-white shadow-[2px_2px_0px_white] flex items-center justify-center dark:bg-white dark:text-black dark:border-black dark:shadow-[2px_2px_0px_black]"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[98] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-[#0A0A0A] border-l-4 border-poppy z-[99] md:hidden p-8 pt-24"
            >
              {/* Internal Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-poppy text-black border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000000]"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      whileTap={{ x: 10 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "block text-[32px] font-black uppercase tracking-tighter transition-colors",
                          isActive ? "text-poppy" : "text-white"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                  System Stats
                </div>
                <div className="h-0.5 w-full bg-poppy/20 mb-4" />
                <div className="text-[12px] font-bold text-[#2FFF2F] uppercase">
                  RYKO V0.1_STABLE
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
