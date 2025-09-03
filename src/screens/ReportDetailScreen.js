import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export const ReportDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { report, user } = route.params || {};

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    primaryColor: '#197ce5',
  };

  if (!report) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={dynamicStyles.mutedText} />
          <Text style={[styles.errorText, { color: dynamicStyles.textColor }]}>
            Report not found
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: dynamicStyles.primaryColor }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'under_review': return '#17a2b8';
      case 'resolved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#637587';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#637587';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Report Details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status and Severity */}
        <View style={styles.statusSection}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(report.status)}20` }]}>
              <Icon name="circle" size={12} color={getStatusColor(report.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                {report.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Text>
            </View>
            <View style={[styles.severityBadge, { borderColor: getSeverityColor(report.severity) }]}>
              <Icon name="alert-triangle" size={12} color={getSeverityColor(report.severity)} />
              <Text style={[styles.severityText, { color: getSeverityColor(report.severity) }]}>
                {report.severity?.toUpperCase() || 'MEDIUM'}
              </Text>
            </View>
          </View>
          <Text style={[styles.timestamp, { color: dynamicStyles.mutedText }]}>
            {formatDate(report.timestamp)}
          </Text>
        </View>

        {/* Main Content */}
        <View style={[styles.contentCard, { backgroundColor: dynamicStyles.cardBackground }]}>
          <Text style={[styles.medicationName, { color: dynamicStyles.textColor }]}>
            {report.medicationName}
          </Text>
          <Text style={[styles.category, { color: dynamicStyles.mutedText }]}>
            {report.category}
          </Text>
          
          <Text style={[styles.description, { color: dynamicStyles.textColor }]}>
            {report.description}
          </Text>
        </View>

        {/* Details Section */}
        <View style={[styles.detailsCard, { backgroundColor: dynamicStyles.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>Report Details</Text>
          
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={16} color={dynamicStyles.mutedText} />
            <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Location:</Text>
            <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]} numberOfLines={2}>
              {report.location}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="shopping-bag" size={16} color={dynamicStyles.mutedText} />
            <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Store:</Text>
            <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]}>
              {report.storeName}
            </Text>
          </View>

          {report.expirationDate && (
            <View style={styles.detailRow}>
              <Icon name="calendar" size={16} color={dynamicStyles.mutedText} />
              <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Expiration:</Text>
              <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]}>
                {new Date(report.expirationDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          {report.batchNumber && (
            <View style={styles.detailRow}>
              <Icon name="hash" size={16} color={dynamicStyles.mutedText} />
              <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Batch:</Text>
              <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]}>
                {report.batchNumber}
              </Text>
            </View>
          )}

          {report.manufacturer && (
            <View style={styles.detailRow}>
              <Icon name="building" size={16} color={dynamicStyles.mutedText} />
              <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Manufacturer:</Text>
              <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]}>
                {report.manufacturer}
              </Text>
            </View>
          )}

          {report.reportAnonymously && (
            <View style={styles.detailRow}>
              <Icon name="eye-off" size={16} color={dynamicStyles.mutedText} />
              <Text style={[styles.detailLabel, { color: dynamicStyles.mutedText }]}>Report Type:</Text>
              <Text style={[styles.detailValue, { color: dynamicStyles.textColor }]}>
                Anonymous Report
              </Text>
            </View>
          )}
        </View>

        {/* Images Section */}
        {report.attachedImages && report.attachedImages.length > 0 && (
          <View style={[styles.imagesCard, { backgroundColor: dynamicStyles.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>Attached Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.attachedImages.map((image, index) => (
                <Image
                  key={image.id || index}
                  source={{ uri: image.uri }}
                  style={styles.reportImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: dynamicStyles.primaryColor }]}
            onPress={() => navigation.navigate('EditMyReports', { report, user })}
          >
            <Icon name="edit" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Edit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timestamp: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  contentCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  medicationName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  imagesCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
