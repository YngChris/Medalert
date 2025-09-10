import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  StyleSheet 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useThemedStyles } from '../hooks/useThemedStyles';

/**
 * ThemedHeader - Consistent header component for all screens
 */
export const ThemedHeader = ({ 
  title, 
  onBackPress, 
  rightComponent, 
  showBackButton = true,
  style = {} 
}) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  return (
    <View style={[commonStyles.header, style]}>
      {showBackButton ? (
        <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
      
      <Text style={commonStyles.headerTitle}>{title}</Text>
      
      <View style={styles.headerButton}>
        {rightComponent}
      </View>
    </View>
  );
};

/**
 * ThemedCard - Consistent card component
 */
export const ThemedCard = ({ children, style = {}, onPress, ...props }) => {
  const { commonStyles } = useThemedStyles();
  
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[commonStyles.card, style]} 
      onPress={onPress}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

/**
 * ThemedText - Consistent text component with theme support
 */
export const ThemedText = ({ 
  variant = 'body', 
  style = {}, 
  children, 
  ...props 
}) => {
  const { commonStyles } = useThemedStyles();
  
  const textStyle = commonStyles[variant] || commonStyles.body;
  
  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

/**
 * ThemedInput - Consistent input component
 */
export const ThemedInput = ({ 
  style = {}, 
  placeholderTextColor,
  ...props 
}) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  return (
    <TextInput
      style={[commonStyles.input, style]}
      placeholderTextColor={placeholderTextColor || dynamicStyles.placeholderText}
      {...props}
    />
  );
};

/**
 * ThemedButton - Consistent button component
 */
export const ThemedButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style = {},
  textStyle = {},
  disabled = false,
  icon,
  ...props 
}) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  const buttonStyle = variant === 'primary' ? commonStyles.primaryButton : commonStyles.secondaryButton;
  const buttonTextStyle = variant === 'primary' ? commonStyles.primaryButtonText : commonStyles.secondaryButtonText;
  
  const disabledStyle = disabled ? {
    backgroundColor: dynamicStyles.disabledBackground,
    borderColor: dynamicStyles.disabledBackground,
  } : {};
  
  const disabledTextStyle = disabled ? {
    color: dynamicStyles.disabledText,
  } : {};
  
  return (
    <TouchableOpacity
      style={[buttonStyle, disabledStyle, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}
    >
      <View style={styles.buttonContent}>
        {icon && <Icon name={icon} size={16} color={buttonTextStyle.color} style={styles.buttonIcon} />}
        <Text style={[buttonTextStyle, disabledTextStyle, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * ThemedSearchBar - Consistent search bar component
 */
export const ThemedSearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search...", 
  onClear,
  style = {} 
}) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  return (
    <View style={[commonStyles.searchContainer, style]}>
      <View style={commonStyles.searchInput}>
        <Icon name="search" size={20} color={dynamicStyles.mutedText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchTextInput}
          placeholder={placeholder}
          placeholderTextColor={dynamicStyles.placeholderText}
          value={value}
          onChangeText={onChangeText}
        />
        {value && value.length > 0 && (
          <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
            <Icon name="x" size={20} color={dynamicStyles.mutedText} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * ThemedFooter - Consistent footer navigation component
 */
export const ThemedFooter = ({ navigation, currentScreen }) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  const footerItems = [
    { name: 'Report', icon: 'file-plus', screen: 'Report' },
    { name: 'Locations', icon: 'map-pin', screen: 'Locations' },
    { name: 'Alerts', icon: 'bell', screen: 'Alerts' },
    { name: 'Education', icon: 'book-open', screen: 'Education' },
    { name: 'Forum', icon: 'users', screen: 'Forum' },
  ];
  
  return (
    <View style={commonStyles.footer}>
      {footerItems.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <TouchableOpacity
            key={item.screen}
            style={commonStyles.footerButton}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon 
              name={item.icon} 
              size={24} 
              color={isActive ? dynamicStyles.primaryColor : dynamicStyles.mutedText} 
            />
            <Text style={[
              commonStyles.footerButtonText,
              isActive && commonStyles.footerButtonTextActive
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * ThemedListItem - Consistent list item component
 */
export const ThemedListItem = ({ 
  title, 
  subtitle, 
  onPress, 
  rightComponent, 
  leftIcon,
  style = {} 
}) => {
  const { commonStyles, dynamicStyles } = useThemedStyles();
  
  return (
    <TouchableOpacity style={[commonStyles.listItem, style]} onPress={onPress}>
      {leftIcon && (
        <View style={styles.listItemIcon}>
          <Icon name={leftIcon} size={20} color={dynamicStyles.primaryColor} />
        </View>
      )}
      
      <View style={styles.listItemContent}>
        <Text style={commonStyles.subtitle}>{title}</Text>
        {subtitle && <Text style={commonStyles.caption}>{subtitle}</Text>}
      </View>
      
      {rightComponent || (
        <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
      )}
    </TouchableOpacity>
  );
};

/**
 * ThemedStatusIndicator - Consistent status indicator component
 */
export const ThemedStatusIndicator = ({ 
  status = 'success', 
  text, 
  style = {} 
}) => {
  const { commonStyles } = useThemedStyles();
  
  const indicatorStyle = commonStyles[`${status}Indicator`] || commonStyles.successIndicator;
  
  return (
    <View style={[indicatorStyle, style]}>
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
  },
  listItemIcon: {
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  indicatorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
