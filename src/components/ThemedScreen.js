import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';

/**
 * ThemedScreen - A wrapper component that provides consistent theming
 * Use this as a base component for all screens to ensure consistent styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.style - Additional styles to apply
 * @param {boolean} props.withPadding - Whether to apply default padding (default: true)
 * @returns {React.Component} Themed screen wrapper
 */
export const ThemedScreen = ({ 
  children, 
  style = {}, 
  withPadding = true,
  ...props 
}) => {
  const { commonStyles } = useThemedStyles();
  
  return (
    <View 
      style={[
        commonStyles.container,
        withPadding && styles.defaultPadding,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultPadding: {
    paddingHorizontal: 16,
  },
});
