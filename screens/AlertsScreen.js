import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';


const todayAlerts = [
  { title: 'Medication Recall', time: '10:30 AM' },
  { title: 'Expired Medication Alert', time: '2:15 PM' },
  { title: 'Nearby Expired Drug Report', time: '3:45 PM' },
];

const yesterdayAlerts = [
  { title: 'Medication Safety Tip', time: '9:00 AM' },
  { title: 'Suspicious Medication Report', time: '11:45 AM' },
  { title: 'Reminder: Check Medication Expiry Dates', time: '5:30 PM' },
];

export const AlertsScreen = () => {
  const navigation = useNavigation();

   // 👇 This hides the default header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderAlertItem = (alert, index) => (
    <TouchableOpacity key={index} style={styles.alertItem}>
      <View style={styles.alertIconContainer}>
        <Icon name="bell" size={24} color="#111418" />
      </View>
      <View style={styles.alertTextContainer}>
        <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
        <Text style={styles.alertTime} numberOfLines={1}>{alert.time}</Text>
      </View>
      <View style={styles.alertArrowContainer}>
        <Icon name="chevron-right" size={24} color="#111418" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Alerts</Text>
        <View style={{ width: 48 }} />
    </View>

      {/* Alerts List */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Today</Text>
        {todayAlerts.map(renderAlertItem)}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Yesterday</Text>
        {yesterdayAlerts.map(renderAlertItem)}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Report')}>
          <Icon name="file-plus" size={24} color="#677583" />
          <Text style={styles.footerButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color="#677583" />
          <Text style={styles.footerButtonText}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]} onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell" size={24} color="#121417" /> 
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color="#677583" />
          <Text style={styles.footerButtonText}>Education</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
          <Icon name="users" size={24} color="#677583" />
          <Text style={styles.footerButtonText}>Forum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    paddingTop:60,
  },
  headerIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: '#111418',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#111418',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f4',
  },
  alertIconContainer: {
    backgroundColor: '#f0f2f4',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  alertTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#111418',
  },
  alertTime: {
    fontWeight: '400',
    fontSize: 14,
    color: '#637588',
    marginTop: 4,
  },
  alertArrowContainer: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f4',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#677583',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonActive: {},
});
