import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert, Modal, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, changeTheme, getThemeColors } = useTheme();
  const { logout } = useAuth();
  const { currentLanguage, changeLanguage: changeAppLanguage, t, getAvailableLanguages } = useLanguage();

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTwoFactor = await AsyncStorage.getItem('twoFactorEnabled');
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
    try {
      await changeTheme(newTheme);
      setShowThemeModal(false);
      
      // Show confirmation with theme-appropriate styling
      const themeMessage = newTheme === 'System' 
        ? t('settings.themeSystemMessage')
        : t('settings.themeChangedMessage', { theme: newTheme });
        
      Alert.alert(t('settings.themeUpdated'), themeMessage, [
        { text: t('ok'), style: 'default' }
      ]);
    } catch (error) {
      console.error('Error changing theme:', error);
      Alert.alert(t('error'), 'Failed to change theme. Please try again.');
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    const success = await changeAppLanguage(newLanguage);
    if (success) {
      setShowLanguageModal(false);
      Alert.alert(t('settings.languageChanged'), t('settings.languageChangedMessage', { language: newLanguage }));
    }
  };


  const toggleTwoFactor = async (value) => {
    setIsTwoFactorEnabled(value);
    saveSetting('twoFactorEnabled', value);
    
    if (value) {
      Alert.alert(
        t('settings.twoFactorEnabled'),
        t('settings.twoFactorEnabledMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('settings.setupNow'), onPress: () => navigation.navigate('TwoFactorSetup') }
        ]
      );
    } else {
      Alert.alert(t('settings.twoFactorDisabled'), t('settings.twoFactorDisabledMessage'));
    }
  };

  const handleHelpCenter = () => {
    Alert.alert(
      t('settings.helpCenterTitle'),
      t('settings.helpCenterMessage'),
      [
        { text: t('settings.copyEmail'), onPress: () => Alert.alert(t('settings.emailCopied')) },
        { text: t('ok'), style: 'default' }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      t('settings.aboutTitle'),
      t('settings.aboutMessage'),
      [{ text: t('ok'), style: 'default' }]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleManageAccounts = () => {
    Alert.alert(
      t('settings.manageAccounts'),
      t('settings.manageAccountsMessage'),
      [{ text: t('ok'), style: 'default' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Clear all authentication-related data from AsyncStorage
              await AsyncStorage.multiRemove([
                'authToken',
                'refreshToken',
                'userData',
                'user'
              ]);
              // Navigate to login or home screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t('error'), t('settings.logoutError'));
            }
          },
        },
      ]
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
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Account Section */}
      <SectionTitle title={t('settings.account')} dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleChangePassword}>
        <RowItem title={t('settings.changePassword')} hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleManageAccounts}>
        <RowItem title={t('settings.manageAccounts')} hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>

      {/* Account Security */}
      <SectionTitle title={t('settings.accountSecurity')} dynamicStyles={dynamicStyles} />
      <View style={[styles.card, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>{t('settings.twoFactorAuth')}</Text>
            <Text style={[styles.cardDescription, { color: dynamicStyles.mutedText }]}>
              {t('settings.twoFactorDesc')}
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
      <SectionTitle title={t('settings.appPreferences')} dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleLanguagePress}>
        <RowItem title={t('settings.language')} rightText={currentLanguage} dynamicStyles={dynamicStyles} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThemePress}>
        <RowItem title={t('settings.theme')} rightText={theme} dynamicStyles={dynamicStyles} />
      </TouchableOpacity>

      {/* Support */}
      <SectionTitle title={t('settings.support')} dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleHelpCenter}>
        <RowItem title={t('settings.helpCenter')} hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAbout}>
        <RowItem title={t('settings.about')} hasArrow dynamicStyles={dynamicStyles} />
      </TouchableOpacity>

      {/* Account Actions */}
      <SectionTitle title={t('settings.accountActions')} dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleLogout}>
        <View style={[styles.row, styles.logoutRow]}>
          <Text style={[styles.rowTitle, styles.logoutText, { color: dynamicStyles.errorColor }]}>{t('settings.logout')}</Text>
          <Icon name="log-out" size={20} color={dynamicStyles.errorColor} />
        </View>
      </TouchableOpacity>


      {/* Modals */}
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={handleLanguageChange}
        currentLanguage={currentLanguage}
        availableLanguages={getAvailableLanguages()}
        dynamicStyles={dynamicStyles}
        t={t}
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
  const { t } = useLanguage();
  const themes = ['System', 'Light', 'Dark'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalOverlay, { backgroundColor: dynamicStyles.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>{t('settings.selectTheme')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={dynamicStyles.textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[styles.modalOption, currentTheme === theme && [styles.modalOptionSelected, { backgroundColor: dynamicStyles.primaryColor + '20' }]]}
                onPress={() => onSelect(theme)}
              >
                <Text style={[styles.modalOptionText, { color: dynamicStyles.textColor }, currentTheme === theme && [styles.modalOptionTextSelected, { color: dynamicStyles.primaryColor }]]}>{theme}</Text>
                {currentTheme === theme && <Icon name="check" size={20} color={dynamicStyles.primaryColor} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------- Language Modal ---------- */
const LanguageModal = ({ visible, onClose, onSelect, currentLanguage, availableLanguages, dynamicStyles, t }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalOverlay, { backgroundColor: dynamicStyles.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>{t('settings.selectLanguage')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={dynamicStyles.textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {availableLanguages.map((lang) => (
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
  logoutRow: { marginTop: 8 },
  logoutText: { fontWeight: '600' },
});

export default SettingsScreen;
