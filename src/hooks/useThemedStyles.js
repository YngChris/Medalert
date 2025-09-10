import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getDynamicStyles, getCommonStyles } from '../utils/themeUtils';

/**
 * Custom hook that provides consistent theming across all screens
 * This hook should be used in every screen component for consistent styling
 * 
 * @returns {Object} Object containing theme colors, dynamic styles, and common styles
 */
export const useThemedStyles = () => {
  const { theme, getThemeColors } = useTheme();
  
  const themeData = useMemo(() => {
    const themeColors = getThemeColors();
    const dynamicStyles = getDynamicStyles(themeColors);
    const commonStyles = getCommonStyles(dynamicStyles);
    
    return {
      theme,
      themeColors,
      dynamicStyles,
      commonStyles,
    };
  }, [theme, getThemeColors]);
  
  return themeData;
};
