/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './Navbar';

const PAGES = ['/', '/scores', '/quality', '/batch', '/methods'];

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = PAGES.indexOf(location.pathname);
  const isComparePage = location.pathname === '/';
  
  const goPrev = () => {
    if (currentIndex > 0) navigate(PAGES[currentIndex - 1]);
    else navigate(PAGES[PAGES.length - 1]);
  };

  const goNext = () => {
    if (currentIndex < PAGES.length - 1) navigate(PAGES[currentIndex + 1]);
    else navigate(PAGES[0]);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans pt-16 md:pt-24 pb-32">
      {/* Subtle overlay to give depth without hiding background pattern */}
      <div className="fixed inset-0 bg-black/5 pointer-events-none z-0 dark:bg-black/20" />
      
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 h-full z-10 relative mt-8 md:mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:bottom-6 md:left-6 md:right-auto md:w-auto md:gap-4 lg:px-0">
        <motion.button
          whileTap={{ y: 2, x: 2 }}
          disabled={currentIndex === 0}
          onClick={goPrev}
          className="w-10 h-10 md:w-11 md:h-11 bg-[#F4D738] border-[3px] border-black shadow-[3px_3px_0px_#000000] dark:border-[#F5F5F5] dark:shadow-[3px_3px_0px_#F5F5F5] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
        </motion.button>
        
        <div className="font-mono text-[10px] md:text-[12px] font-black tracking-widest text-black dark:text-[#F5F5F5] px-4">
          {String(currentIndex + 1).padStart(2, '0')} / {String(PAGES.length).padStart(2, '0')}
        </div>

        <motion.button
          whileTap={{ y: 2, x: 2 }}
          disabled={currentIndex === PAGES.length - 1}
          onClick={goNext}
          className="w-10 h-10 md:w-11 md:h-11 bg-[#F4D738] border-[3px] border-black shadow-[3px_3px_0px_#000000] dark:border-[#F5F5F5] dark:shadow-[3px_3px_0px_#F5F5F5] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4 text-black" />
        </motion.button>
      </div>
    </div>
  );
};
