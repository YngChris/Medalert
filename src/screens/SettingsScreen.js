import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert, Modal, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, changeTheme, getThemeColors } = useTheme();

  const [language, setLanguage] = useState('English');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedTwoFactor = await AsyncStorage.getItem('twoFactorEnabled');

      if (savedLanguage) setLanguage(savedLanguage);
      if (savedTwoFactor) setIsTwoFactorEnabled(JSON.parse(savedTwoFactor));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleThemePress = () => {
    setShowThemeModal(true);
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };


  const changeThemeHandler = async (newTheme) => {
    await changeTheme(newTheme);
    setShowThemeModal(false);
    Alert.alert('Theme Changed', `Theme changed to ${newTheme}`);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    saveSetting('language', newLanguage);
    setShowLanguageModal(false);
    Alert.alert('Language Changed', `Language changed to ${newLanguage}`);
  };


  const toggleTwoFactor = async (value) => {
    setIsTwoFactorEnabled(value);
    saveSetting('twoFactorEnabled', value);
    
    if (value) {
      Alert.alert(
        'Two-Factor Authentication Enabled',
        'Please set up your two-factor authentication method in the next step.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set Up Now', onPress: () => navigation.navigate('TwoFactorSetup') }
        ]
      );
    } else {
      Alert.alert('Two-Factor Authentication Disabled', 'Your account is now less secure.');
    }
  };

  const handleHelpCenter = () => {
    Alert.alert(
      'Help Center',
      'For assistance, please contact our support team at support@medalert.com or call +1-800-MEDALERT',
      [
        { text: 'Copy Email', onPress: () => Alert.alert('Email copied to clipboard') },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature will be implemented in the next update. For now, please contact support.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleManageAccounts = () => {
    Alert.alert(
      'Manage Connected Accounts',
      'This feature will be implemented in the next update. For now, please contact support.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const dynamicStyles = getThemeColors();

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Account Section */}
      <SectionTitle title="Account" dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleChangePassword}>
        <RowItem title="Change Password" hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleManageAccounts}>
        <RowItem title="Manage Connected Accounts" hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>

      {/* Account Security */}
      <SectionTitle title="Account Security" dynamicStyles={dynamicStyles} />
      <View style={[styles.card, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>Two-Factor Authentication</Text>
            <Text style={[styles.cardDescription, { color: dynamicStyles.mutedText }]}>
              Enable two-factor authentication for enhanced security
            </Text>
          </View>
          <Switch
            value={isTwoFactorEnabled}
            onValueChange={toggleTwoFactor}
            trackColor={{ false: dynamicStyles.borderColor, true: dynamicStyles.primaryColor }}
            thumbColor={isTwoFactorEnabled ? dynamicStyles.accentColor : dynamicStyles.inputBackground}
          />
        </View>
      </View>

      {/* App Preferences */}
      <SectionTitle title="App Preferences" dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleLanguagePress}>
        <RowItem title="Language" rightText={language} dynamicStyles={dynamicStyles} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThemePress}>
        <RowItem title="Theme" rightText={theme} dynamicStyles={dynamicStyles} />
      </TouchableOpacity>

      {/* Support */}
      <SectionTitle title="Support" dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleHelpCenter}>
        <RowItem title="Help Center" hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>


      {/* Modals */}
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={changeLanguage}
        currentLanguage={language}
        dynamicStyles={dynamicStyles}
      />
      
      <ThemeModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onSelect={changeThemeHandler}
        currentTheme={theme}
        dynamicStyles={dynamicStyles}
      />
      
    </ScrollView>
  );
};

/* ---------- Reusable Components ---------- */
const SectionTitle = ({ title, dynamicStyles }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>{title}</Text>
  </View>
);

const RowItem = ({ title, hasArrow, rightText, dynamicStyles }) => (
  <View style={styles.row}>
    <Text style={[styles.rowTitle, { color: dynamicStyles.textColor }]}>{title}</Text>
    {rightText ? (
      <Text style={[styles.rowRightText, { color: dynamicStyles.textColor }]}>{rightText}</Text>
    ) : hasArrow ? (
      <Icon name="chevron-right" size={24} color={dynamicStyles.textColor} />
    ) : null}
  </View>
);


/* ---------- Theme Modal ---------- */
const ThemeModal = ({ visible, onClose, onSelect, currentTheme, dynamicStyles }) => {
  const themes = ['System', 'Light', 'Dark'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalOverlay, { backgroundColor: dynamicStyles.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>Select Theme</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={dynamicStyles.textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {themes.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.modalOption, currentTheme === t && [styles.modalOptionSelected, { backgroundColor: dynamicStyles.primaryColor + '20' }]]}
                onPress={() => onSelect(t)}
              >
                <Text style={[styles.modalOptionText, { color: dynamicStyles.textColor }, currentTheme === t && [styles.modalOptionTextSelected, { color: dynamicStyles.primaryColor }]]}>{t}</Text>
                {currentTheme === t && <Icon name="check" size={20} color={dynamicStyles.primaryColor} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------- Language Modal (same as yours but shortened) ---------- */
const LanguageModal = ({ visible, onClose, onSelect, currentLanguage, dynamicStyles }) => {
  const languages = ['English', 'Spanish', 'French', 'German'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalOverlay, { backgroundColor: dynamicStyles.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>Select Language</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={dynamicStyles.textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.modalOption, currentLanguage === lang && [styles.modalOptionSelected, { backgroundColor: dynamicStyles.primaryColor + '20' }]]}
                onPress={() => onSelect(lang)}
              >
                <Text style={[styles.modalOptionText, { color: dynamicStyles.textColor }, currentLanguage === lang && [styles.modalOptionTextSelected, { color: dynamicStyles.primaryColor }]]}>{lang}</Text>
                {currentLanguage === lang && <Icon name="check" size={20} color={dynamicStyles.primaryColor} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  section: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { paddingHorizontal: 16 },
  cardContent: { minHeight: 72, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '500' },
  cardDescription: { fontSize: 14, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56, paddingHorizontal: 16 },
  rowTitle: { fontSize: 16 },
  rowRightText: { fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 10, width: '80%', maxHeight: '70%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  modalOptionSelected: {},
  modalOptionText: { fontSize: 16 },
  modalOptionTextSelected: { fontWeight: 'bold' },
});

export default SettingsScreen;
