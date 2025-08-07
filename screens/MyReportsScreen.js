import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const initialReports = [
  {
    medication: 'Aspirin',
    description: 'Found expired pills in the cabinet.',
    location: '123 Main St, Anytown',
    date: '2023-11-15',
  },
  {
    medication: 'Ibuprofen',
    description: 'Suspicious packaging, seal broken.',
    location: '456 Oak Ave, Anytown',
    date: '2023-11-10',
  },
  {
    medication: 'Amoxicillin',
    description: 'Wrong medication in the bottle.',
    location: '789 Pine Ln, Anytown',
    date: '2023-11-05',
  },
];

const ReportItem = ({ report, onEdit, onDelete }) => (
  <View style={styles.reportItem}>
    <View style={styles.reportTextContainer}>
      <Text style={styles.medicationText}>Medication: {report.medication}</Text>
      <Text style={styles.descriptionText}>Description: {report.description}</Text>
      <Text style={styles.locationText}>Reported Location: {report.location}</Text>
    </View>
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{report.date}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
          <Icon name="edit" size={18} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <Icon name="trash-2" size={18} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const MyReportsScreen = () => {
  const [reports, setReports] = useState(initialReports);
  const [deletedReports, setDeletedReports] = useState([]);
  const lastDeletedReport = useRef(null);
  const navigation = useNavigation();

  const handleDelete = (index) => {
    const deleted = reports[index];
    lastDeletedReport.current = { ...deleted, index };
    setDeletedReports((prev) => [...prev, deleted]);

    const updated = [...reports];
    updated.splice(index, 1);
    setReports(updated);

    Toast.show({
      type: 'info',
      text1: 'Report moved to Recycle Bin',
      text2: 'Tap to undo',
      onPress: () => handleUndo(),
      visibilityTime: 5000,
    });
  };

  const handleUndo = () => {
    const { index, ...report } = lastDeletedReport.current || {};
    if (report && typeof index === 'number') {
      const restored = [...reports];
      restored.splice(index, 0, report);
      setReports(restored);

      setDeletedReports((prev) =>
        prev.filter((item) => item.date !== report.date || item.medication !== report.medication)
      );

      lastDeletedReport.current = null;
      Toast.hide();
    }
  };

  const handleEdit = (index) => {
    Alert.alert('Edit Report', `Edit ${reports[index].medication}`);
  };

  const goToRecycleBin = () => {
    navigation.navigate('RecycleBin', { deletedReports });
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#121417" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports</Text>
          <TouchableOpacity style={styles.iconButton} onPress={goToRecycleBin}>
            <Icon name="trash-2" size={22} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {/* Reports */}
        <ScrollView style={styles.reportsList}>
          {reports.map((report, index) => (
            <ReportItem
              key={index}
              report={report}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]} onPress={() => navigation.navigate('Report')}>
            <Icon name="file-plus" size={24} color="#111418" />
            <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Locations')}>
            <Icon name="map-pin" size={24} color="#637588" />
            <Text style={styles.footerButtonText}>Locations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Alerts')}>
            <Icon name="bell" size={24} color="#637588" />
            <Text style={styles.footerButtonText}>Alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton}  onPress={() => navigation.navigate('Education')}>
            <Icon name="book-open" size={24} color="#637588" />
            <Text style={styles.footerButtonText}>Education</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
            <Icon name="users" size={24} color="#637588" />
            <Text style={styles.footerButtonText}>Forum</Text>
          </TouchableOpacity>
        </View>
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
    paddingLeft:0,
    paddingRight:10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: '#121417',
    paddingTop: 20,
    paddingRight:10,
  },
  reportsList: { flex: 1 },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f4',
  },
  reportTextContainer: {
    flex: 1,
  },
  medicationText: {
    color: '#121417',
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionText: {
    color: '#677583',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  locationText: {
    color: '#677583',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  dateContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#677583',
    fontSize: 14,
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#197ce5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 10,
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
  footerButtonTextActive: {
    color: '#111418',
    fontWeight: '700',
  },
});
