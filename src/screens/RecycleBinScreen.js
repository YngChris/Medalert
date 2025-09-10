import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { reportsStorage } from '../utils/reportsStorage';

export const RecycleBinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { deletedReports: initialDeletedReports = [], onRestore } = route.params || {};

  const [deletedReports, setLocalDeletedReports] = useState(initialDeletedReports);

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    primaryColor: '#197ce5',
    dangerColor: '#d32f2f',
    blackColor: '#000',
  };

  useEffect(() => {
    // Load deleted reports from storage when component mounts
    const loadDeletedReports = async () => {
      try {
        const deleted = await reportsStorage.getDeletedReports();
        setLocalDeletedReports(deleted);
      } catch (error) {
        console.error('Error loading deleted reports:', error);
      }
    };
    
    loadDeletedReports();
  }, []);

  const handleRestore = async (report) => {
    try {
      // Restore report to main storage
      await reportsStorage.restoreReport(report);
      
      // Remove from deleted reports storage
      await reportsStorage.removeDeletedReport(report.id);

      // Remove it from local state to reflect change instantly
      setLocalDeletedReports((prev) =>
        prev.filter((r) => r.id !== report.id)
      );

      Toast.show({
        type: 'success',
        text1: 'Restored',
        text2: `${report.medicationName || report.medication} has been restored to My Reports.`,
      });
    } catch (error) {
      console.error('Error restoring report:', error);
      Alert.alert('Error', 'Failed to restore report. Please try again.');
    }
  };

  const handleEmptyBin = async () => {
    Alert.alert(
      'Empty Recycle Bin',
      'Are you sure you want to permanently delete all reports?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await reportsStorage.clearDeletedReports();
              setLocalDeletedReports([]);
              Toast.show({
                type: 'success',
                text1: 'Bin Emptied',
                text2: 'All reports have been permanently deleted.',
              });
            } catch (error) {
              console.error('Error emptying bin:', error);
              Alert.alert('Error', 'Failed to empty bin. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Recycle Bin</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handleEmptyBin}>
            <Icon name="trash-2" size={22} color={dynamicStyles.dangerColor} />
          </TouchableOpacity>
        </View>

        {deletedReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="trash-2" size={64} color={dynamicStyles.mutedText} />
            <Text style={[styles.emptyText, { color: dynamicStyles.textColor }]}>Recycle Bin Empty</Text>
            <Text style={[styles.emptySubtext, { color: dynamicStyles.mutedText }]}>
              Deleted reports will appear here
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {deletedReports.map((report, index) => (
              <View key={report.id || index} style={[styles.reportItem, { 
                backgroundColor: dynamicStyles.cardBackground,
                borderColor: dynamicStyles.borderColor 
              }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.titleText, { color: dynamicStyles.textColor }]}>
                    {report.medicationName || report.medication}
                  </Text>
                  <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]}>
                    {report.description}
                  </Text>
                  <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]}>
                    {report.location}
                  </Text>
                  <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]}>
                    Store: {report.storeName}
                  </Text>
                  <Text style={[styles.dateText, { color: dynamicStyles.mutedText }]}>
                    {new Date(report.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleRestore(report)} style={styles.restoreBtn}>
                  <Icon name="rotate-ccw" size={20} color={dynamicStyles.primaryColor} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  restoreBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(25, 124, 229, 0.1)',
  },
});
