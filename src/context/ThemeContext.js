import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_TOKENS = {
  // 5-Color Palette Tokens (Linen, Khaki, Camel, Cocoa, Espresso)
  '--color-linen': '#F5F1EA',
  '--color-khaki': '#D7C9B8',
  '--color-camel': '#B2967D',
  '--color-cocoa': '#7D5A44',
  '--color-espresso': '#4A342A',

  // Global Design Tokens
  '--color-primary': '#4A342A',
  '--color-secondary': '#7D5A44',
  '--color-tertiary': '#B2967D',
  '--color-bg-deep': '#D7C9B8',
  '--color-bg-accent': '#D7C9B8',
  '--color-bg-light': '#F5F1EA',

  // Website Background
  '--SkyRoute-bg': '#F5F1EA',
  '--SkyRoute-bg-subtle': '#D7C9B8',
  '--SkyRoute-bg-deep': '#B2967D',

  // Cards & Surfaces
  '--SkyRoute-surface': '#F5F1EA',
  '--SkyRoute-card-bg': '#F5F1EA',
  '--SkyRoute-card-secondary': '#D7C9B8',
  '--SkyRoute-card-deep': '#B2967D',
  '--SkyRoute-card-elevated': '#F5F1EA',
  '--SkyRoute-sidebar-bg': '#D7C9B8',
  '--SkyRoute-sidebar-bottom-bg': '#D7C9B8',

  // Navbar / Header
  '--SkyRoute-header-bg': '#F5F1EA',

  // UI / Component Colors
  '--SkyRoute-navy': '#4A342A',
  '--SkyRoute-navy-hover': '#7D5A44',
  '--SkyRoute-teal': '#7D5A44',
  '--SkyRoute-teal-hover': '#4A342A',
  '--SkyRoute-teal-light': '#D7C9B8',
  '--SkyRoute-sky-blue': '#B2967D',
  '--SkyRoute-sky-blue-hover': '#7D5A44',
  '--SkyRoute-beige': '#D7C9B8',
  '--SkyRoute-white': '#F5F1EA',
  '--SkyRoute-rose': '#7D5A44',
  '--SkyRoute-rose-hover': '#4A342A',
  '--SkyRoute-rose-light': '#D7C9B8',
  '--SkyRoute-lavender': '#B2967D',
  '--SkyRoute-mauve': '#D7C9B8',
  '--SkyRoute-charcoal': '#4A342A',
  '--SkyRoute-stone': '#B2967D',
  '--SkyRoute-latte': '#7D5A44',
  '--SkyRoute-dark-brown': '#4A342A',

  // Buttons
  '--SkyRoute-primary': '#4A342A',
  '--SkyRoute-primary-hover': '#7D5A44',
  '--SkyRoute-primary-light': '#D7C9B8',
  '--SkyRoute-primary-text': '#F5F1EA',

  '--SkyRoute-secondary': '#7D5A44',
  '--SkyRoute-secondary-hover': '#4A342A',
  '--SkyRoute-secondary-light': '#B2967D',
  '--SkyRoute-secondary-text': '#F5F1EA',

  '--SkyRoute-accent': '#B2967D',
  '--SkyRoute-accent-hover': '#7D5A44',
  '--SkyRoute-accent-light': '#D7C9B8',

  // Typography
  '--SkyRoute-text-main': '#4A342A',
  '--SkyRoute-text': '#4A342A',
  '--SkyRoute-text-secondary': '#7D5A44',
  '--SkyRoute-text-muted': '#B2967D',
  '--SkyRoute-card-text-main': '#4A342A',
  '--SkyRoute-card-text': '#4A342A',
  '--SkyRoute-card-text-secondary': '#7D5A44',
  '--SkyRoute-card-text-muted': '#B2967D',

  // Inputs & Forms
  '--SkyRoute-border': '#B2967D',
  '--SkyRoute-border-light': '#D7C9B8',
  '--SkyRoute-border-focus': '#7D5A44',

  '--SkyRoute-input-bg': '#F5F1EA',
  '--SkyRoute-input-border': '#B2967D',
  '--SkyRoute-input-text': '#4A342A',
  '--SkyRoute-input-placeholder': '#7D5A44',
  '--SkyRoute-hover': 'rgba(125, 90, 68, 0.1)',

  '--SkyRoute-chip-date-bg': '#D7C9B8',
  '--SkyRoute-chip-date-text': '#4A342A',
  '--SkyRoute-chip-item-bg': '#F5F1EA',
  '--SkyRoute-chip-item-text': '#4A342A',

  '--SkyRoute-logo-bg': '#4A342A',
  '--SkyRoute-logo-color': '#F5F1EA',

  '--SkyRoute-nav-active-bg': '#7D5A44',
  '--SkyRoute-nav-active-text': '#F5F1EA',
  '--SkyRoute-nav-active-icon': '#D7C9B8',
  '--SkyRoute-nav-hover-bg': 'rgba(178, 150, 125, 0.2)',

  '--SkyRoute-shadow-sm': '0 2px 8px rgba(74, 52, 42, 0.06)',
  '--SkyRoute-shadow-md': '0 6px 18px rgba(74, 52, 42, 0.09)',
  '--SkyRoute-shadow-lg': '0 12px 30px rgba(74, 52, 42, 0.12)',
  '--SkyRoute-shadow-card': '0 4px 16px rgba(74, 52, 42, 0.07)',
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
