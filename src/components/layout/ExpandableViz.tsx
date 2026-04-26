/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableVizProps {
  children: React.ReactNode;
  className?: string;
  title: string;
}

export const ExpandableViz: React.FC<ExpandableVizProps> = ({ children, className, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isExpanded]);

  return (
    <div className={cn("relative group w-full h-full", className)}>
      <motion.button
        layout
        onClick={() => setIsExpanded(true)}
        className="absolute top-2 right-2 z-10 flex items-center gap-1.5 h-7 px-3 bg-[#9FF700] text-black text-[10px] font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all opacity-0 group-hover:opacity-100 md:hidden"
      >
        EXPAND ↗
      </motion.button>
      
      {/* Show expand icon clearly on mobile since hover isn't reliable */}
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute top-2 right-2 z-10 md:hidden p-2 bg-[#9FF700] border-2 border-black text-black"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <motion.button
        layout
        onClick={() => setIsExpanded(true)}
        className="absolute top-2 right-2 z-10 hidden md:group-hover:flex items-center gap-1.5 h-7 px-3 bg-[#9FF700] text-black text-[10px] font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
      >
        EXPAND ↗
      </motion.button>

      <motion.div layoutId={`viz-container-${title}`} className="w-full h-full">
        {children}
      </motion.div>

      <AnimatePresence>
        {isExpanded && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-12 bg-off-white/95 dark:bg-dark-canvas/95 backdrop-blur-md"
          >
            <motion.div
              layoutId={`viz-container-${title}`}
              className="relative w-full h-full border-b-[8px] md:border-4 border-black dark:border-[#F5F5F5] p-6 md:p-12 bg-off-white dark:bg-dark-canvas flex flex-col items-center justify-center shadow-2xl"
            >
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <h2 className="text-[20px] md:text-[28px] font-black uppercase tracking-tighter text-black dark:text-[#F5F5F5]">
                  {title} <span className="text-poppy">.EXPLORER</span>
                </h2>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 z-20 flex items-center gap-1.5 h-12 px-8 bg-poppy text-black text-[14px] font-black uppercase border-4 border-black shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                CLOSE [X]
              </button>

              <div className="w-full h-full mt-24 md:mt-0 flex items-center justify-center overflow-hidden">
                 <div className="w-full h-[85%] md:h-[90%] pointer-events-auto" key="expanded-viz-content">
                    {children}
                 </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-40 font-mono text-[10px] md:text-xs">
                <span>SYSTEM_OVERRIDE_ENABLED</span>
                <span className="hidden md:inline">Z-INDEX_10000_ISOLATED</span>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};
