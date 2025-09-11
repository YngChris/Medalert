import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('System');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on app start
  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const applyTheme = (selectedTheme) => {
    let actualTheme = selectedTheme;
    
    if (selectedTheme === 'System') {
      actualTheme = systemColorScheme || 'light';
    }

    // Theme colors are applied through the getThemeColors function
    // which returns the appropriate color scheme for React Native components
  };

  const changeTheme = async (newTheme) => {
    // Update theme state immediately for instant UI changes
    setTheme(newTheme);
    
    // Save to storage asynchronously (non-blocking)
    saveTheme(newTheme).catch(error => {
      console.error('Error saving theme:', error);
    });
  };

  const getThemeColors = () => {
    let actualTheme = theme;
    
    if (theme === 'System') {
      actualTheme = systemColorScheme || 'light';
    }

    if (actualTheme === 'dark' || actualTheme === 'Dark') {
      return {
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
        cardBackground: '#1a1a1a',
        borderColor: '#2a2a2a',
        primaryColor: '#007AFF',
        secondaryColor: '#5856D6',
        successColor: '#30D158',
        warningColor: '#FF9F0A',
        errorColor: '#FF453A',
        mutedText: '#8e8e93',
        inputBackground: '#1c1c1e',
        shadowColor: '#000000',
        // Additional professional dark theme colors
        surfaceBackground: '#0f0f0f',
        elevatedBackground: '#2c2c2e',
        separatorColor: '#38383a',
        secondaryText: '#98989d',
        tertiaryText: '#48484a',
        accentColor: '#0A84FF',
        successBackground: '#1a2e1a',
        warningBackground: '#2e1a1a',
        errorBackground: '#2e1a1a',
        overlayBackground: 'rgba(0, 0, 0, 0.8)',
        cardShadow: 'rgba(0, 0, 0, 0.3)',
        inputBorder: '#3a3a3c',
        inputPlaceholder: '#636366',
        buttonText: '#ffffff',
        disabledBackground: '#1c1c1e',
        disabledText: '#48484a',
        modalOverlay: 'rgba(0, 0, 0, 0.8)',
      };
    } else {
      return {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        cardBackground: '#f8f9fa',
        borderColor: '#dee2e6',
        primaryColor: '#007AFF',
        secondaryColor: '#5856D6',
        successColor: '#34C759',
        warningColor: '#FF9500',
        errorColor: '#FF3B30',
        mutedText: '#637587',
        inputBackground: '#ffffff',
        shadowColor: '#000000',
        // Additional light theme colors
        surfaceBackground: '#f8f9fa',
        elevatedBackground: '#ffffff',
        separatorColor: '#e5e5ea',
        secondaryText: '#8e8e93',
        tertiaryText: '#c7c7cc',
        accentColor: '#0A84FF',
        successBackground: '#f0f9f0',
        warningBackground: '#fff9f0',
        errorBackground: '#fff0f0',
        overlayBackground: 'rgba(0, 0, 0, 0.5)',
        cardShadow: 'rgba(0, 0, 0, 0.1)',
        inputBorder: '#dee2e6',
        inputPlaceholder: '#8e8e93',
        buttonText: '#ffffff',
        disabledBackground: '#f2f2f7',
        disabledText: '#8e8e93',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
      };
    }
  };

  const value = {
    theme,
    changeTheme,
    getThemeColors,
    isLoading,
    systemColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
