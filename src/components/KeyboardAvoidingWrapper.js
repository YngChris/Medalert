import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

const KeyboardAvoidingWrapper = ({ 
  children, 
  behavior = 'padding',
  keyboardVerticalOffset = 0,
  enableOnAndroid = true,
  style = {},
  contentContainerStyle = {},
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  ...props 
}) => {
  // Determine the best behavior for each platform
  const getBehavior = () => {
    if (Platform.OS === 'ios') {
      return behavior;
    }
    // For Android, use 'height' if enableOnAndroid is true, otherwise undefined
    return enableOnAndroid ? 'height' : undefined;
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={getBehavior()}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          bounces={false}
          overScrollMode="never"
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
