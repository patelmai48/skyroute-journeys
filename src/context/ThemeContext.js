import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_TOKENS = {
  // 3-Color Deep Navy (#143F67) + Warm Gold (#E4B46C) + Clean White (#FAFBFC) System
  '--color-navy': '#143F67',
  '--color-navy-dark': '#143F67',
  '--color-navy-slate': '#1E5282',
  '--color-navy-light': '#E2E8F0',
  '--color-gold': '#E4B46C',
  '--color-gold-hover': '#D39F52',
  '--color-gold-light': '#FBF3E4',
  '--color-white': '#FFFFFF',
  '--color-offwhite': '#FAFBFC',
  '--color-border': '#E2E8F0',

  // Backwards compatibility palette tokens
  '--color-linen': '#FAFBFC',
  '--color-khaki': '#FBF3E4',
  '--color-camel': '#E4B46C',
  '--color-cocoa': '#1E5282',
  '--color-espresso': '#143F67',

  // Global Design Tokens
  '--color-primary': '#143F67',
  '--color-secondary': '#E4B46C',
  '--color-tertiary': '#1E5282',
  '--color-bg-deep': '#FAFBFC',
  '--color-bg-accent': '#FBF3E4',
  '--color-bg-light': '#FFFFFF',

  // Website Background
  '--SkyRoute-bg': '#FAFBFC',
  '--SkyRoute-bg-subtle': '#FFFFFF',
  '--SkyRoute-bg-deep': '#143F67',

  // Cards & Surfaces
  '--SkyRoute-surface': '#FFFFFF',
  '--SkyRoute-card-bg': '#FFFFFF',
  '--SkyRoute-card-secondary': '#FAFBFC',
  '--SkyRoute-card-deep': '#143F67',
  '--SkyRoute-card-elevated': '#FFFFFF',
  '--SkyRoute-sidebar-bg': '#143F67',
  '--SkyRoute-sidebar-bottom-bg': '#103456',

  // Navbar / Header (Deep Navy Brand #143F67)
  '--SkyRoute-header-bg': '#143F67',

  // UI / Component Colors
  '--SkyRoute-navy': '#143F67',
  '--SkyRoute-navy-hover': '#1E5282',
  '--SkyRoute-teal': '#143F67',
  '--SkyRoute-teal-hover': '#1E5282',
  '--SkyRoute-teal-light': '#FBF3E4',
  '--SkyRoute-sky-blue': '#E4B46C',
  '--SkyRoute-sky-blue-hover': '#D39F52',
  '--SkyRoute-beige': '#FBF3E4',
  '--SkyRoute-white': '#FAFBFC',
  '--SkyRoute-gold': '#E4B46C',
  '--SkyRoute-rose': '#E4B46C',
  '--SkyRoute-rose-hover': '#D39F52',
  '--SkyRoute-rose-light': '#FBF3E4',
  '--SkyRoute-lavender': '#FBF3E4',
  '--SkyRoute-mauve': '#FAFBFC',
  '--SkyRoute-charcoal': '#143F67',
  '--SkyRoute-stone': '#E2E8F0',
  '--SkyRoute-latte': '#E4B46C',
  '--SkyRoute-dark-brown': '#143F67',

  // Buttons
  '--SkyRoute-primary': '#E4B46C',
  '--SkyRoute-primary-hover': '#D39F52',
  '--SkyRoute-primary-light': '#FBF3E4',
  '--SkyRoute-primary-text': '#143F67',

  '--SkyRoute-secondary': '#143F67',
  '--SkyRoute-secondary-hover': '#1E5282',
  '--SkyRoute-secondary-light': '#1E5282',
  '--SkyRoute-secondary-text': '#FAFBFC',

  '--SkyRoute-accent': '#E4B46C',
  '--SkyRoute-accent-hover': '#D39F52',
  '--SkyRoute-accent-light': '#FBF3E4',

  // Typography
  '--SkyRoute-text-main': '#143F67',
  '--SkyRoute-text': '#143F67',
  '--SkyRoute-text-secondary': '#1E5282',
  '--SkyRoute-text-muted': '#1E5282',
  '--SkyRoute-card-text-main': '#143F67',
  '--SkyRoute-card-text': '#143F67',
  '--SkyRoute-card-text-secondary': '#1E5282',
  '--SkyRoute-card-text-muted': '#1E5282',

  // Inputs & Forms
  '--SkyRoute-border': '#E2E8F0',
  '--SkyRoute-border-light': '#E2E8F0',
  '--SkyRoute-border-focus': '#E4B46C',

  '--SkyRoute-input-bg': '#FFFFFF',
  '--SkyRoute-input-border': '#E2E8F0',
  '--SkyRoute-input-text': '#143F67',
  '--SkyRoute-input-placeholder': '#1E5282',
  '--SkyRoute-hover': 'rgba(20, 63, 103, 0.06)',

  '--SkyRoute-chip-date-bg': '#FBF3E4',
  '--SkyRoute-chip-date-text': '#143F67',
  '--SkyRoute-chip-item-bg': '#FFFFFF',
  '--SkyRoute-chip-item-text': '#143F67',

  '--SkyRoute-logo-bg': '#143F67',
  '--SkyRoute-logo-color': '#FAFBFC',

  '--SkyRoute-nav-active-bg': '#E4B46C',
  '--SkyRoute-nav-active-text': '#143F67',
  '--SkyRoute-nav-active-icon': '#143F67',
  '--SkyRoute-nav-hover-bg': 'rgba(228, 180, 108, 0.18)',

  '--SkyRoute-shadow-sm': '0 2px 8px rgba(20, 63, 103, 0.06)',
  '--SkyRoute-shadow-md': '0 6px 18px rgba(20, 63, 103, 0.09)',
  '--SkyRoute-shadow-lg': '0 12px 30px rgba(20, 63, 103, 0.14)',
  '--SkyRoute-shadow-card': '0 4px 16px rgba(20, 63, 103, 0.07)',
};

export const applyPermanentTheme = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-mode', 'day');
    document.body.setAttribute('data-theme', 'light');
    document.body.className = 'theme-light theme-day';

    Object.entries(THEME_TOKENS).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val);
    });
  }
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    applyPermanentTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        isDark: false,
        isLight: true,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      isDark: false,
      isLight: true,
    };
  }
  return context;
};

export default ThemeContext;
