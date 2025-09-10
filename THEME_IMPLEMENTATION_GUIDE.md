# Theme Implementation Guide for Medalert App

This guide explains how to ensure consistent theming across all screens in your Medalert app.

## Overview

The app now has a comprehensive theming system with:
- **ThemeContext**: Centralized theme management with dark/light/system modes
- **Theme Utils**: Standardized styling utilities
- **Themed Components**: Pre-built components with consistent styling
- **Custom Hook**: Easy-to-use hook for accessing theme data

## Quick Start - Converting Existing Screens

### Step 1: Replace the old theme usage

**Before:**
```javascript
import { useTheme } from '../context/ThemeContext';

const { theme } = useTheme();
const dynamicStyles = {
  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
  textColor: theme === 'dark' ? '#ffffff' : '#111418',
  // ... manual color definitions
};
```

**After:**
```javascript
import { useThemedStyles } from '../hooks/useThemedStyles';

const { dynamicStyles, commonStyles } = useThemedStyles();
```

### Step 2: Use the pre-built components

**Replace manual headers:**
```javascript
// Before
<View style={[styles.header, { backgroundColor: dynamicStyles.backgroundColor }]}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
  </TouchableOpacity>
  <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Title</Text>
</View>

// After
<ThemedHeader 
  title="Title" 
  onBackPress={() => navigation.goBack()} 
/>
```

**Replace manual cards:**
```javascript
// Before
<View style={[styles.card, { backgroundColor: dynamicStyles.cardBackground }]}>
  <Text style={[styles.title, { color: dynamicStyles.textColor }]}>Title</Text>
</View>

// After
<ThemedCard>
  <ThemedText variant="title">Title</ThemedText>
</ThemedCard>
```

## Complete Example - Converting a Screen

Here's how to convert any screen to use the new theming system:

```javascript
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  ThemedScreen,
  ThemedHeader, 
  ThemedCard, 
  ThemedText, 
  ThemedButton,
  ThemedSearchBar,
  ThemedFooter 
} from '../components/ThemedComponents';

export const ExampleScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  return (
    <ThemedScreen>
      <ThemedHeader 
        title="Example Screen" 
        onBackPress={() => navigation.goBack()} 
      />
      
      <ThemedSearchBar 
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search items..."
      />
      
      <ScrollView style={{ flex: 1 }}>
        <ThemedCard>
          <ThemedText variant="title">Card Title</ThemedText>
          <ThemedText variant="body">Card content goes here</ThemedText>
          <ThemedButton 
            title="Action Button" 
            onPress={() => console.log('Pressed')} 
          />
        </ThemedCard>
      </ScrollView>
      
      <ThemedFooter navigation={navigation} currentScreen="Example" />
    </ThemedScreen>
  );
};
```

## Available Components

### Core Components
- `ThemedScreen` - Base screen wrapper
- `ThemedHeader` - Consistent header with back button
- `ThemedCard` - Styled card container
- `ThemedText` - Text with theme-aware colors
- `ThemedButton` - Primary/secondary buttons
- `ThemedInput` - Themed text input
- `ThemedSearchBar` - Search input with icon
- `ThemedFooter` - Bottom navigation
- `ThemedListItem` - List item with consistent styling
- `ThemedStatusIndicator` - Status badges (success/warning/error)

### Text Variants
- `title` - Large title text
- `subtitle` - Medium subtitle text
- `body` - Regular body text
- `caption` - Small caption text

### Button Variants
- `primary` - Filled primary button
- `secondary` - Outlined secondary button

## Theme Colors Available

The `dynamicStyles` object provides access to all theme colors:

```javascript
const { dynamicStyles } = useThemedStyles();

// Background colors
dynamicStyles.backgroundColor
dynamicStyles.cardBackground
dynamicStyles.surfaceBackground
dynamicStyles.elevatedBackground

// Text colors
dynamicStyles.textColor
dynamicStyles.secondaryText
dynamicStyles.mutedText
dynamicStyles.placeholderText

// Brand colors
dynamicStyles.primaryColor
dynamicStyles.secondaryColor
dynamicStyles.accentColor

// Status colors
dynamicStyles.successColor
dynamicStyles.warningColor
dynamicStyles.errorColor

// Border colors
dynamicStyles.borderColor
dynamicStyles.separatorColor
```

## Migration Checklist

For each screen in your app:

- [ ] Replace `useTheme()` with `useThemedStyles()`
- [ ] Remove manual `dynamicStyles` object creation
- [ ] Replace manual headers with `ThemedHeader`
- [ ] Replace manual cards with `ThemedCard`
- [ ] Replace manual text with `ThemedText`
- [ ] Replace manual buttons with `ThemedButton`
- [ ] Replace manual inputs with `ThemedInput`
- [ ] Replace manual footers with `ThemedFooter`
- [ ] Use `commonStyles` for consistent spacing and layout
- [ ] Test both light and dark themes

## Benefits

✅ **Consistent Design**: All screens will have identical styling
✅ **Easy Maintenance**: Change colors in one place, update everywhere
✅ **Automatic Theme Support**: Dark/light mode works automatically
✅ **Reduced Code**: Less repetitive styling code
✅ **Better Performance**: Memoized theme calculations
✅ **Type Safety**: Standardized component props
✅ **Future-Proof**: Easy to add new themes or modify existing ones

## Next Steps

1. Start with your most important screens (Home, Login, etc.)
2. Convert one screen at a time using the examples above
3. Test each screen in both light and dark modes
4. Remove old styling code once conversion is complete
5. Enjoy consistent, maintainable theming across your entire app!
