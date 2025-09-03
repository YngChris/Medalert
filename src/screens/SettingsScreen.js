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
  const [alertFrequency, setAlertFrequency] = useState('Daily');
  const [alertTypes, setAlertTypes] = useState(['Drug Recalls', 'Safety Alerts']);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAlertFrequencyModal, setShowAlertFrequencyModal] = useState(false);
  const [showAlertTypesModal, setShowAlertTypesModal] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedTwoFactor = await AsyncStorage.getItem('twoFactorEnabled');
      const savedAlertFrequency = await AsyncStorage.getItem('alertFrequency');
      const savedAlertTypes = await AsyncStorage.getItem('alertTypes');

      if (savedLanguage) setLanguage(savedLanguage);
      if (savedTwoFactor) setIsTwoFactorEnabled(JSON.parse(savedTwoFactor));
      if (savedAlertFrequency) setAlertFrequency(savedAlertFrequency);
      if (savedAlertTypes) setAlertTypes(JSON.parse(savedAlertTypes));
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

  const handleAlertFrequencyPress = () => {
    setShowAlertFrequencyModal(true);
  };

  const handleAlertTypesPress = () => {
    setShowAlertTypesModal(true);
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

  const changeAlertFrequency = (newFrequency) => {
    setAlertFrequency(newFrequency);
    saveSetting('alertFrequency', newFrequency);
    setShowAlertFrequencyModal(false);
    Alert.alert('Alert Frequency Changed', `Alerts will be sent ${newFrequency.toLowerCase()}`);
  };

  const changeAlertTypes = (newTypes) => {
    setAlertTypes(newTypes);
    saveSetting('alertTypes', newTypes);
    setShowAlertTypesModal(false);
    Alert.alert('Alert Types Updated', 'Your alert preferences have been updated');
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
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isTwoFactorEnabled ? '#f5dd4b' : '#f4f3f4'}
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

      {/* Notifications */}
      <SectionTitle title="Notifications" dynamicStyles={dynamicStyles} />
      <TouchableOpacity onPress={handleAlertFrequencyPress}>
        <NotificationRow
          title="Alert Frequency"
          description={`Currently: ${alertFrequency}`}
          dynamicStyles={dynamicStyles}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAlertTypesPress}>
        <NotificationRow
          title="Alert Types"
          description={`${alertTypes.length} types selected`}
          dynamicStyles={dynamicStyles}
        />
      </TouchableOpacity>

      {/* Modals */}
      <LanguageModal 
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={changeLanguage}
        currentLanguage={language}
      />
      
      <ThemeModal 
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onSelect={changeThemeHandler}
        currentTheme={theme}
      />
      
      <AlertFrequencyModal 
        visible={showAlertFrequencyModal}
        onClose={() => setShowAlertFrequencyModal(false)}
        onSelect={changeAlertFrequency}
        currentFrequency={alertFrequency}
      />
      
      <AlertTypesModal 
        visible={showAlertTypesModal}
        onClose={() => setShowAlertTypesModal(false)}
        onSelect={changeAlertTypes}
        currentTypes={alertTypes}
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

const NotificationRow = ({ title, description, dynamicStyles }) => (
  <View style={styles.notificationItem}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>{title}</Text>
      <Text style={[styles.cardDescription, { color: dynamicStyles.mutedText }]}>{description}</Text>
    </View>
    <Icon name="chevron-right" size={24} color={dynamicStyles.textColor} />
  </View>
);

/* ---------- Theme Modal ---------- */
const ThemeModal = ({ visible, onClose, onSelect, currentTheme }) => {
  const themes = ['System', 'Light', 'Dark'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#111416" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {themes.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.modalOption, currentTheme === t && styles.modalOptionSelected]}
                onPress={() => onSelect(t)}
              >
                <Text style={[styles.modalOptionText, currentTheme === t && styles.modalOptionTextSelected]}>{t}</Text>
                {currentTheme === t && <Icon name="check" size={20} color="#007AFF" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------- Language Modal (same as yours but shortened) ---------- */
const LanguageModal = ({ visible, onClose, onSelect, currentLanguage }) => {
  const languages = ['English', 'Spanish', 'French', 'German'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#111416" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.modalOption, currentLanguage === lang && styles.modalOptionSelected]}
                onPress={() => onSelect(lang)}
              >
                <Text style={[styles.modalOptionText, currentLanguage === lang && styles.modalOptionTextSelected]}>{lang}</Text>
                {currentLanguage === lang && <Icon name="check" size={20} color="#007AFF" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------- Alert Frequency Modal ---------- */
const AlertFrequencyModal = ({ visible, onClose, onSelect, currentFrequency }) => {
  const frequencies = ['Immediate', 'Hourly', 'Daily', 'Weekly', 'Monthly'];
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alert Frequency</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#111416" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[styles.modalOption, currentFrequency === freq && styles.modalOptionSelected]}
                onPress={() => onSelect(freq)}
              >
                <Text style={[styles.modalOptionText, currentFrequency === freq && styles.modalOptionTextSelected]}>{freq}</Text>
                {currentFrequency === freq && <Icon name="check" size={20} color="#007AFF" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------- Alert Types Modal ---------- */
const AlertTypesModal = ({ visible, onClose, onSelect, currentTypes }) => {
  const allAlertTypes = ['Drug Recalls', 'Safety Alerts', 'New Medications', 'Health News'];
  const [selectedTypes, setSelectedTypes] = useState(currentTypes);

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSave = () => {
    onSelect(selectedTypes);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alert Types</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: '#007AFF' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {allAlertTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.modalOption, selectedTypes.includes(type) && styles.modalOptionSelected]}
                onPress={() => toggleType(type)}
              >
                <Text style={[styles.modalOptionText, selectedTypes.includes(type) && styles.modalOptionTextSelected]}>{type}</Text>
                {selectedTypes.includes(type) && <Icon name="check" size={20} color="#007AFF" />}
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
  notificationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 72, paddingHorizontal: 16, paddingVertical: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, width: '80%', maxHeight: '70%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  modalOptionSelected: { backgroundColor: '#f0f9eb' },
  modalOptionText: { fontSize: 16 },
  modalOptionTextSelected: { fontWeight: 'bold', color: '#007AFF' },
});

export default SettingsScreen;
