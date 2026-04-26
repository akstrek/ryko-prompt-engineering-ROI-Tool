/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// src/components/layout/ThemeService.ts
// Manages the application theme state and persistence.

export type Theme = 'light' | 'dark';

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem('ryko-theme') as Theme;
  if (saved === 'light' || saved === 'dark') return saved;
  
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  return mql.matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('ryko-theme', theme);
};
