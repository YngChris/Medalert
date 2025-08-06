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

export const RecycleBinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deletedReports: initialDeletedReports = [], restoreReport, setDeletedReports } = route.params || {};

  const [deletedReports, setLocalDeletedReports] = useState(initialDeletedReports);

  useEffect(() => {
    // Sync local state with main state
    setDeletedReports?.(deletedReports);
  }, [deletedReports]);

  const handleRestore = (report) => {
    restoreReport?.(report);

    // Remove it from local state to reflect change instantly
    setLocalDeletedReports((prev) =>
      prev.filter(
        (r) => r.medication !== report.medication || r.date !== report.date
      )
    );

    Toast.show({
      type: 'success',
      text1: 'Restored',
      text2: `${report.medication} has been restored.`,
    });
  };

  const handleEmptyBin = () => {
    Alert.alert(
      'Empty Recycle Bin',
      'Are you sure you want to permanently delete all reports?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            setLocalDeletedReports([]);
            setDeletedReports?.([]);
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#121417" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recycle Bin</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handleEmptyBin}>
            <Icon name="trash-2" size={22} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {deletedReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Recycle Bin Empty</Text>
          </View>
        ) : (
          <ScrollView style={styles.list}>
            {deletedReports.map((report, index) => (
              <View key={index} style={styles.reportItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleText}>Medication: {report.medication}</Text>
                  <Text style={styles.detailText}>Description: {report.description}</Text>
                  <Text style={styles.detailText}>Location: {report.location}</Text>
                  <Text style={styles.dateText}>Date: {report.date}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRestore(report)} style={styles.restoreBtn}>
                  <Icon name="rotate-ccw" size={20} color="#1976d2" />
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop:40,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: '#121417',
    paddingTop: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f4',
    paddingVertical: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121417',
  },
  detailText: {
    fontSize: 14,
    color: '#677583',
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#a1a6b0',
    marginTop: 4,
  },
  restoreBtn: {
    marginLeft: 8,
    marginTop: 4,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#e8f0fe',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#677583',
    fontStyle: 'italic',
  },
});
