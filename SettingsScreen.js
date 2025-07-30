import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [theme, setTheme] = useState('System');
  const [language, setLanguage] = useState('English');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const handleThemePress = () => {
    const nextTheme =
      theme === 'System' ? 'Light' : theme === 'Light' ? 'Dark' : 'System';
    setTheme(nextTheme);
    Alert.alert('Theme Changed', `Current theme: ${nextTheme}`);
  };

  const handleLanguagePress = () => {
    const nextLanguage = language === 'English' ? 'French' : 'English';
    setLanguage(nextLanguage);
    Alert.alert('Language Changed', `Current language: ${nextLanguage}`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // TODO: Add your logout logic here
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Replace with your login route
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111416" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Account Section */}
      <SectionTitle title="Account" />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <RowItem title="Profile" hasArrow />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <RowItem title="Logout" />
      </TouchableOpacity>

      {/* Account Security */}
      <SectionTitle title="Account Security" />
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Two-Factor Authentication</Text>
            <Text style={styles.cardDescription}>
              Enable two-factor authentication for enhanced security
            </Text>
          </View>
          <Switch
            value={isTwoFactorEnabled}
            onValueChange={setIsTwoFactorEnabled}
          />
        </View>
      </View>

      {/* App Preferences */}
      <SectionTitle title="App Preferences" />
      <TouchableOpacity onPress={handleLanguagePress}>
        <RowItem title="Language" rightText={language} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThemePress}>
        <RowItem title="Theme" rightText={theme} />
      </TouchableOpacity>

      {/* Support */}
      <SectionTitle title="Support" />
      <RowItem title="Help Center" hasArrow />

      {/* Notifications */}
      <SectionTitle title="Notifications" />
      <NotificationRow
        title="Alert Frequency"
        description="Customize the frequency of alerts"
      />
      <NotificationRow
        title="Alert Types"
        description="Select the types of alerts you wish to receive"
      />
    </ScrollView>
  );
};

// Reusable components

const SectionTitle = ({ title }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const RowItem = ({ title, hasArrow, rightText }) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>{title}</Text>
    {rightText ? (
      <Text style={styles.rowRightText}>{rightText}</Text>
    ) : hasArrow ? (
      <Icon name="chevron-right" size={24} color="#111416" />
    ) : null}
  </View>
);

const NotificationRow = ({ title, description }) => (
  <View style={styles.notificationItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#111416" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111416',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111416',
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cardContent: {
    minHeight: 72,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111416',
  },
  cardDescription: {
    fontSize: 14,
    color: '#637587',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  rowTitle: {
    fontSize: 16,
    color: '#111416',
  },
  rowRightText: {
    fontSize: 16,
    color: '#111416',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default SettingsScreen;
