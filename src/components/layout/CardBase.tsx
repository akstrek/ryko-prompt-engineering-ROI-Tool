/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardBaseProps extends HTMLMotionProps<'div'> {
  variant?: 'standard' | 'dark' | 'accent' | 'response-b';
  children: React.ReactNode;
  className?: string;
}

export const CardBase: React.FC<CardBaseProps> = ({ 
  variant = 'standard', 
  children, 
  className,
  ...props 
}) => {
  const baseStyles = "chamfer-card border-[3px] border-black p-4 md:p-6 transition-colors relative";
  
  const variants = {
    standard: "bg-[#F5F5F5] shadow-[4px_4px_0px_#000000] text-black dark:bg-[#0A0A0A] dark:border-[#F5F5F5] dark:shadow-[4px_4px_0px_#F5F5F5] dark:text-[#F5F5F5]",
    dark: "bg-[#0A0A0A] border-black shadow-[4px_4px_0px_#000000] text-[#F5F5F5] dark:border-[#F5F5F5] dark:shadow-[4px_4px_0px_#F5F5F5]",
    accent: "bg-[#D8560E] border-black shadow-[4px_4px_0px_#000000] text-black dark:border-[#F5F5F5] dark:shadow-[4px_4px_0px_#F5F5F5]",
    'response-b': "bg-[#BAFCA2] border-black shadow-[4px_4px_0px_#000000] text-[#2FFF2F] dark:border-[#F5F5F5] dark:shadow-[4px_4px_0px_#F5F5F5]"
  };

  return (
    <motion.div 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const HeaderStrip: React.FC<{ 
  title: string; 
  variant?: 'poppy' | 'black' | 'white' | 'resp-b';
  className?: string;
}> = ({ title, variant = 'poppy', className }) => {
  const styles = {
    poppy: "bg-[#D8560E] text-black",
    black: "bg-black text-white",
    white: "bg-[#F5F5F5] text-black",
    'resp-b': "bg-black text-[#2FFF2F]"
  };

  return (
    <div className={cn(
      "absolute top-0 left-[16px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
      styles[variant],
      className
    )}>
      {title}
    </div>
  );
};
