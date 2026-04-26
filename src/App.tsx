/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';

const ComparePage = lazy(() => import('./pages/Compare'));
const ScoresPage = lazy(() => import('./pages/Scores'));
const QualityPage = lazy(() => import('./pages/Quality'));
const BatchPage = lazy(() => import('./pages/Batch'));
const MethodsPage = lazy(() => import('./pages/Methods'));

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <PageLayout>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Routes>
              <Route path="/" element={<ComparePage />} />
              <Route path="/scores" element={<ScoresPage />} />
              <Route path="/quality" element={<QualityPage />} />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/methods" element={<MethodsPage />} />
            </Routes>
          </Suspense>
        </PageLayout>
      </Router>
    </ThemeProvider>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-[24px] font-black uppercase tracking-widest animate-pulse text-poppy">
        LOADING SYSTEM...
      </div>
    </div>
  );
}
