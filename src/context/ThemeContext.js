import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_TOKENS = {
  // Exact Teal + Deep Green Palette Tokens
  '--color-linen': '#F5F7F2',
  '--color-khaki': '#DDE8E3',
  '--color-camel': '#8FAFA6',
  '--color-cocoa': '#4F7C73',
  '--color-espresso': '#173F3A',

  // Global Design Tokens
  '--color-primary': '#173F3A',
  '--color-secondary': '#285C54',
  '--color-tertiary': '#4F7C73',
  '--color-bg-deep': '#DDE8E3',
  '--color-bg-accent': '#DDE8E3',
  '--color-bg-light': '#F5F7F2',

  // Website Background
  '--SkyRoute-bg': '#F5F7F2',
  '--SkyRoute-bg-subtle': '#DDE8E3',
  '--SkyRoute-bg-deep': '#8FAFA6',

  // Cards & Surfaces
  '--SkyRoute-surface': '#FFFFFF',
  '--SkyRoute-card-bg': '#FFFFFF',
  '--SkyRoute-card-secondary': '#DDE8E3',
  '--SkyRoute-card-deep': '#8FAFA6',
  '--SkyRoute-card-elevated': '#FFFFFF',
  '--SkyRoute-sidebar-bg': '#DDE8E3',
  '--SkyRoute-sidebar-bottom-bg': '#DDE8E3',

  // Navbar / Header
  '--SkyRoute-header-bg': '#F5F7F2',

  // UI / Component Colors
  '--SkyRoute-navy': '#173F3A',
  '--SkyRoute-navy-hover': '#285C54',
  '--SkyRoute-teal': '#4F7C73',
  '--SkyRoute-teal-hover': '#285C54',
  '--SkyRoute-teal-light': '#DDE8E3',
  '--SkyRoute-sky-blue': '#8FAFA6',
  '--SkyRoute-sky-blue-hover': '#4F7C73',
  '--SkyRoute-beige': '#DDE8E3',
  '--SkyRoute-white': '#FFFFFF',
  '--SkyRoute-rose': '#285C54',
  '--SkyRoute-rose-hover': '#173F3A',
  '--SkyRoute-rose-light': '#DDE8E3',
  '--SkyRoute-lavender': '#8FAFA6',
  '--SkyRoute-mauve': '#DDE8E3',
  '--SkyRoute-charcoal': '#173F3A',
  '--SkyRoute-stone': '#8FAFA6',
  '--SkyRoute-latte': '#4F7C73',
  '--SkyRoute-dark-brown': '#173F3A',

  // Buttons
  '--SkyRoute-primary': '#173F3A',
  '--SkyRoute-primary-hover': '#285C54',
  '--SkyRoute-primary-light': '#DDE8E3',
  '--SkyRoute-primary-text': '#FFFFFF',

  '--SkyRoute-secondary': '#4F7C73',
  '--SkyRoute-secondary-hover': '#173F3A',
  '--SkyRoute-secondary-light': '#8FAFA6',
  '--SkyRoute-secondary-text': '#FFFFFF',

  '--SkyRoute-accent': '#4F7C73',
  '--SkyRoute-accent-hover': '#285C54',
  '--SkyRoute-accent-light': '#DDE8E3',

  // Typography
  '--SkyRoute-text-main': '#173F3A',
  '--SkyRoute-text': '#173F3A',
  '--SkyRoute-text-secondary': '#285C54',
  '--SkyRoute-text-muted': '#4F7C73',
  '--SkyRoute-card-text-main': '#173F3A',
  '--SkyRoute-card-text': '#173F3A',
  '--SkyRoute-card-text-secondary': '#285C54',
  '--SkyRoute-card-text-muted': '#4F7C73',

  // Inputs & Forms
  '--SkyRoute-border': '#8FAFA6',
  '--SkyRoute-border-light': '#DDE8E3',
  '--SkyRoute-border-focus': '#4F7C73',

  '--SkyRoute-input-bg': '#FFFFFF',
  '--SkyRoute-input-border': '#8FAFA6',
  '--SkyRoute-input-text': '#173F3A',
  '--SkyRoute-input-placeholder': '#8FAFA6',
  '--SkyRoute-hover': 'rgba(40, 92, 84, 0.1)',

  '--SkyRoute-chip-date-bg': '#DDE8E3',
  '--SkyRoute-chip-date-text': '#173F3A',
  '--SkyRoute-chip-item-bg': '#FFFFFF',
  '--SkyRoute-chip-item-text': '#173F3A',

  '--SkyRoute-logo-bg': '#173F3A',
  '--SkyRoute-logo-color': '#FFFFFF',

  '--SkyRoute-nav-active-bg': '#173F3A',
  '--SkyRoute-nav-active-text': '#FFFFFF',
  '--SkyRoute-nav-active-icon': '#DDE8E3',
  '--SkyRoute-nav-hover-bg': 'rgba(143, 175, 166, 0.2)',

  '--SkyRoute-shadow-sm': '0 2px 8px rgba(23, 63, 58, 0.06)',
  '--SkyRoute-shadow-md': '0 6px 18px rgba(23, 63, 58, 0.09)',
  '--SkyRoute-shadow-lg': '0 12px 30px rgba(23, 63, 58, 0.12)',
  '--SkyRoute-shadow-card': '0 4px 16px rgba(23, 63, 58, 0.07)',
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
