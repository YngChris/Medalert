/**
 * Theme Utilities - Centralized theme management for consistent styling across all screens
 */

/**
 * Get standardized dynamic styles for any screen
 * @param {Object} themeColors - Colors from useTheme().getThemeColors()
 * @returns {Object} Standardized style object
 */
export const getDynamicStyles = (themeColors) => {
  return {
    // Background colors
    backgroundColor: themeColors.backgroundColor,
    surfaceBackground: themeColors.surfaceBackground,
    cardBackground: themeColors.cardBackground || themeColors.elevatedBackground,
    elevatedBackground: themeColors.elevatedBackground,
    inputBackground: themeColors.inputBackground,
    overlayBackground: themeColors.overlayBackground,
    
    // Text colors
    textColor: themeColors.textColor,
    secondaryText: themeColors.secondaryText || themeColors.mutedText,
    mutedText: themeColors.mutedText,
    tertiaryText: themeColors.tertiaryText,
    placeholderText: themeColors.inputPlaceholder,
    buttonText: themeColors.buttonText,
    disabledText: themeColors.disabledText,
    
    // Brand colors
    primaryColor: themeColors.primaryColor,
    secondaryColor: themeColors.secondaryColor,
    accentColor: themeColors.accentColor,
    
    // Status colors
    successColor: themeColors.successColor,
    warningColor: themeColors.warningColor,
    errorColor: themeColors.errorColor,
    successBackground: themeColors.successBackground,
    warningBackground: themeColors.warningBackground,
    errorBackground: themeColors.errorBackground,
    
    // Border and separator colors
    borderColor: themeColors.borderColor,
    separatorColor: themeColors.separatorColor,
    inputBorder: themeColors.inputBorder,
    
    // Shadow and elevation
    shadowColor: themeColors.shadowColor,
    cardShadow: themeColors.cardShadow,
    
    // Interactive states
    disabledBackground: themeColors.disabledBackground,
  };
};

/**
 * Get common component styles that work across all themes
 * @param {Object} dynamicStyles - Result from getDynamicStyles()
 * @returns {Object} Common component styles
 */
export const getCommonStyles = (dynamicStyles) => {
  return {
    // Container styles
    container: {
      flex: 1,
      backgroundColor: dynamicStyles.backgroundColor,
    },
    
    // Header styles
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      paddingTop: 50,
      backgroundColor: dynamicStyles.backgroundColor,
    },
    
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: dynamicStyles.textColor,
      textAlign: 'center',
      flex: 1,
    },
    
    // Card styles
    card: {
      backgroundColor: dynamicStyles.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: dynamicStyles.borderColor,
      shadowColor: dynamicStyles.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    
    // Text styles
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: dynamicStyles.textColor,
      marginBottom: 8,
    },
    
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: dynamicStyles.textColor,
      marginBottom: 4,
    },
    
    body: {
      fontSize: 14,
      color: dynamicStyles.secondaryText,
      lineHeight: 20,
    },
    
    caption: {
      fontSize: 12,
      color: dynamicStyles.mutedText,
    },
    
    // Input styles
    input: {
      backgroundColor: dynamicStyles.inputBackground,
      borderWidth: 1,
      borderColor: dynamicStyles.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: dynamicStyles.textColor,
    },
    
    // Button styles
    primaryButton: {
      backgroundColor: dynamicStyles.primaryColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    
    primaryButtonText: {
      color: dynamicStyles.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: dynamicStyles.primaryColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    
    secondaryButtonText: {
      color: dynamicStyles.primaryColor,
      fontSize: 16,
      fontWeight: '600',
    },
    
    // Footer navigation
    footer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: dynamicStyles.separatorColor,
      backgroundColor: dynamicStyles.backgroundColor,
      paddingVertical: 8,
      paddingHorizontal: 4,
      justifyContent: 'space-around',
    },
    
    footerButton: {
      alignItems: 'center',
      flex: 1,
    },
    
    footerButtonText: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 2,
      color: dynamicStyles.mutedText,
    },
    
    footerButtonTextActive: {
      color: dynamicStyles.primaryColor,
    },
    
    // Search styles
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dynamicStyles.inputBackground,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,
      borderWidth: 1,
      borderColor: dynamicStyles.inputBorder,
    },
    
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: dynamicStyles.overlayBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    modalContent: {
      backgroundColor: dynamicStyles.cardBackground,
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxWidth: 400,
    },
    
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: dynamicStyles.textColor,
      marginBottom: 16,
      textAlign: 'center',
    },
    
    // List styles
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: dynamicStyles.separatorColor,
      backgroundColor: dynamicStyles.cardBackground,
    },
    
    // Status indicators
    successIndicator: {
      backgroundColor: dynamicStyles.successColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    
    warningIndicator: {
      backgroundColor: dynamicStyles.warningColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    
    errorIndicator: {
      backgroundColor: dynamicStyles.errorColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
  };
};

/**
 * Custom hook to get both dynamic styles and common styles
 * @param {Object} themeColors - Colors from useTheme().getThemeColors()
 * @returns {Object} Object containing both dynamicStyles and commonStyles
 */
export const useThemedStyles = (themeColors) => {
  const dynamicStyles = getDynamicStyles(themeColors);
  const commonStyles = getCommonStyles(dynamicStyles);
  
  return {
    dynamicStyles,
    commonStyles,
  };
};

/**
 * Helper function to create theme-aware StyleSheet
 * @param {Function} styleFunction - Function that receives dynamicStyles and returns StyleSheet object
 * @param {Object} themeColors - Colors from useTheme().getThemeColors()
 * @returns {Object} StyleSheet object
 */
export const createThemedStyles = (styleFunction, themeColors) => {
  const dynamicStyles = getDynamicStyles(themeColors);
  return styleFunction(dynamicStyles);
};
