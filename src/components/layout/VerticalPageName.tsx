/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/lib/utils';

export const VerticalPageName: React.FC<{ name: string; height?: string }> = ({ name }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-start w-[56px] h-full pt-4">
      <h1 className={cn(
        "font-display font-black uppercase text-[#9FF700] tracking-[0.3em] select-none pointer-events-none",
        "text-[clamp(38px,5.5vw,67px)]",
        "[writing-mode:vertical-rl] [text-orientation:mixed] rotate-180"
      )}>
        {name}
      </h1>
    </div>
  );
};
