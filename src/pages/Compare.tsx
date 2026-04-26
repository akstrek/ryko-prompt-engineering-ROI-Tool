/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CardBase, HeaderStrip } from '../components/layout/CardBase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { TaskType } from '../types';
import { runComparison } from '../lib/api';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('Analytical');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getTokens = (text: string) => Math.ceil(text.length / 4);
  
  const getValidationState = (text: string) => {
    if (text.length === 0) return 'empty';
    if (text.length > 3000) return 'error';
    if (text.length > 2000) return 'warning';
    return 'valid';
  };

  const handleRun = async () => {
    setIsLoading(true);
    setProgress(10);
    const interval = setInterval(() => setProgress(prev => Math.min(prev + 5, 90)), 300);
    
    try {
      await runComparison(promptA, promptB, taskType);
      setProgress(100);
      setTimeout(() => window.location.href = '/scores', 500);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const isError = getValidationState(promptA) === 'error' || getValidationState(promptB) === 'error';
  const isEmpty = promptA.length === 0 || promptB.length === 0;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-4 items-start min-h-screen pb-20 md:pb-12">
      {/* Left Column: Brand */}
      <div className="w-full lg:col-span-3 flex flex-col justify-start pt-4 items-center lg:items-start text-center lg:text-left">
        <div className="flex flex-col mb-4 lg:mb-8">
           <span className="text-[48px] md:text-[clamp(48px,7vw,96px)] font-black leading-[0.85] text-poppy dark:text-magenta transition-colors">
            旅行
          </span>
          <h1 className="text-[48px] md:text-[clamp(48px,7vw,96px)] font-display font-black leading-[0.85] tracking-tight text-black dark:text-[#F5F5F5] uppercase">
            RYKO
          </h1>
        </div>

        <div className="w-full max-w-sm space-y-2 mb-4">
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 dark:text-[#F5F5F5]/60 block text-left">
            TASK TYPE
          </label>
          <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
            <SelectTrigger className="w-full bg-[#0A0A0A] text-white border-2 border-black dark:border-[#F5F5F5] h-12 rounded-none shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#F5F5F5]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-2 border-black rounded-none">
              <SelectItem value="Factual">Factual</SelectItem>
              <SelectItem value="Creative">Creative</SelectItem>
              <SelectItem value="Analytical">Analytical</SelectItem>
              <SelectItem value="Instructional">Instructional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-[10px] font-mono text-black/50 dark:text-[#F5F5F5]/50 mt-4 lg:mt-6 uppercase">
          vs FastAPI scorer at {((import.meta as any).env.VITE_API_URL as string) || 'http://localhost:8000'}
        </p>
      </div>

      {/* Center Column: Inputs */}
      <div className="w-full lg:col-span-5 space-y-4">
        <PromptCard 
          label="PROMPT A" 
          value={promptA} 
          onChange={setPromptA} 
          tokens={getTokens(promptA)}
          state={getValidationState(promptA)}
        />
        <PromptCard 
          label="PROMPT B" 
          value={promptB} 
          onChange={setPromptB} 
          tokens={getTokens(promptB)}
          state={getValidationState(promptB)}
        />
      </div>

      {/* Right Column: ROI & Control */}
      <div className="w-full lg:col-span-4 space-y-4 flex flex-col lg:h-full">
        <CardBase variant="accent" className="flex flex-col justify-between min-h-[160px] lg:h-[240px] p-6 shadow-[8px_8px_0px_#000000]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.08em] mb-1">ROI SCORE</p>
            <h2 className="text-roi-pink text-5xl lg:text-7xl font-black leading-none mt-2" style={{ fontFamily: 'Anton, sans-serif' }}>--</h2>
            <p className="font-mono text-[10px] opacity-60 mt-1 uppercase tracking-tighter">quality delta / cost delta</p>
          </div>
          <p className="text-xs font-bold leading-tight mt-4">Ready to evaluate quality gain vs token cost</p>
        </CardBase>

        <div className="space-y-4">
          <Button
            disabled={isLoading || isError || isEmpty}
            onClick={handleRun}
            className={cn(
              "w-full h-16 md:h-16 text-[18px] md:text-[20px] font-black uppercase tracking-widest bg-poppy text-black border-[3px] border-black shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-none",
              (isLoading || isError || isEmpty) && "opacity-30 cursor-not-allowed bg-black text-white"
            )}
          >
            RUN COMPARISON →
          </Button>

          {isLoading && (
            <div className="space-y-4">
              <div className="bg-white/5 dark:bg-black/20 p-4 border-2 border-dashed border-black dark:border-[#F5F5F5]">
                <Progress value={progress} className="h-6 rounded-none border-2 border-black bg-white dark:bg-[#1A1A1A]">
                   <div className="h-full bg-poppy transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" style={{ width: `${progress}%` }} />
                </Progress>
                <div className="flex justify-between font-mono text-[10px] md:text-[12px] font-black mt-3">
                  <span className="text-black dark:text-[#F5F5F5] uppercase tracking-widest">SCORING_V2_ACTIVE...</span>
                  <span className="text-poppy">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PromptCard({ label, value, onChange, tokens, state }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  tokens: number;
  state: string;
}) {
  const borderColor = state === 'error' ? 'border-magenta' : state === 'warning' ? 'border-yellow' : value.length > 0 ? 'border-poppy' : 'border-black';
  const textColor = state === 'error' ? 'text-magenta' : state === 'warning' ? 'text-black' : value.length > 0 ? 'text-poppy' : 'text-black/40';

  return (
    <CardBase variant="dark" className={cn("p-0 min-h-[220px] overflow-hidden", borderColor)}>
      <HeaderStrip title={label} variant="poppy" />
      <div className="p-6 pt-10 h-full flex flex-col">
        <Textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter prompt template here..."
          className="flex-grow bg-[#0A0A0A] border-none text-white font-mono text-[13px] resize-none focus-visible:ring-0 placeholder:text-white/20 px-0 no-scrollbar"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {state === 'warning' && (
              <span className="bg-yellow text-black text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black">
                HIGH COST WARNING
              </span>
            )}
            {state === 'error' && (
              <span className="bg-magenta text-black text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black">
                EXCEEDS LIMIT
              </span>
            )}
          </div>
          <span className={cn("font-mono text-[10px] font-medium", textColor)}>
            {value.length} chars / ~{tokens} tokens
          </span>
        </div>
      </div>
    </CardBase>
  );
}
