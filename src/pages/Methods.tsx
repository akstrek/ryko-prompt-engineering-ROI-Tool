/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CardBase, HeaderStrip } from '../components/layout/CardBase';
import { VerticalPageName } from '../components/layout/VerticalPageName';
import { getScoringApproach, getKnownLimitations } from '../lib/methodsContent';

export default function MethodsPage() {
  const [scoringApproach, setScoringApproach] = useState<string>('Loading scoring approach...');
  const [limitations, setLimitations] = useState<string[]>([]);
  const apiUrl = ((import.meta as any).env.VITE_API_URL as string) || 'http://localhost:8000';

  useEffect(() => {
    getScoringApproach(apiUrl).then(setScoringApproach);
    getKnownLimitations(apiUrl).then(setLimitations);
  }, [apiUrl]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-screen pb-20">
      <VerticalPageName name="METHODS" />
      
      <div className="flex-grow flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-4 pb-12">
        <CardBase className="h-auto md:h-full shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="ROI FORMULA" variant="poppy" />
          <div className="pt-8">
            <div className="bg-[#0A0A0A] p-6 text-white font-mono rounded-none border-2 border-black mb-6 md:mb-8 shadow-[4px_4px_0px_#D8560E]">
              <div className="text-[10px] opacity-60 mb-2 font-mono">// core measurement</div>
              <div className="text-sm md:text-xl">
                ROI = <span className="text-poppy">quality_delta</span> / (<span className="text-magenta">cost_delta</span> + 0.0001)
              </div>
            </div>
            <p className="text-[12px] md:text-[13px] leading-relaxed dark:text-white">
              We define prompt efficiency as the ratio of quality improvement over the additional cost incurred. 
              The 0.0001 constant prevents division by zero when prompts have identical costs.
            </p>
          </div>
        </CardBase>

        <CardBase className="h-auto md:h-full shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="SCORING APPROACH" variant="black" />
          <div className="pt-8 space-y-4">
            <p className="text-[12px] md:text-[13px] leading-relaxed whitespace-pre-wrap dark:text-white">
              {scoringApproach}
            </p>
            <div className="p-4 border-2 border-black bg-white/50 dark:bg-white italic text-[11px] md:text-[12px] text-black">
              "Automatic scoring reduces the evaluation bottleneck from hours to seconds."
            </div>
          </div>
        </CardBase>

        <CardBase className="h-auto md:h-full shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="EVALUATION DIMENSIONS" variant="poppy" />
          <div className="pt-8 space-y-4">
             <DimensionItem name="ACCURACY" desc="Factual correctness and absence of hallucinations." />
             <DimensionItem name="COMPLETENESS" desc="All parts of the prompt instructions were addressed." />
             <DimensionItem name="CLARITY" desc="Syntactic flow and lexical precision." />
             <DimensionItem name="FORMAT COMPLIANCE" desc="Adherence to schema, tone, and structural constraints." />
          </div>
        </CardBase>

        <CardBase className="h-auto md:h-full shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#F5F5F5]">
          <HeaderStrip title="KNOWN LIMITATIONS" variant="resp-b" />
          <div className="pt-8 space-y-4">
            <ul className="space-y-3">
              {limitations.map((limitation, idx) => (
                <li key={idx} className="flex gap-3 text-[11px] md:text-[12px] leading-relaxed text-black dark:text-white">
                  <span className="text-magenta font-black">/</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardBase>
      </div>
    </div>
  );
}

function DimensionItem({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="border-b border-black/10 dark:border-white/10 pb-3 last:border-0">
      <h4 className="text-[12px] md:text-[13px] font-black uppercase tracking-tight text-black dark:text-white">{name}</h4>
      <p className="text-[11px] md:text-xs text-black/60 dark:text-white/60">{desc}</p>
    </div>
  );
}
