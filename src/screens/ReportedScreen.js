import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Sample reports data - in a real app, this would come from your backend
const sampleReports = [
  {
    id: '1',
    medicationName: 'Aspirin 500mg',
    description: 'Found expired pills in the cabinet. The medication was stored beyond its expiration date and shows signs of discoloration.',
    location: '123 Main St, Anytown, NY',
    storeName: 'CVS Pharmacy',
    category: 'Over-the-Counter',
    severity: 'medium',
    expirationDate: '2023-11-15',
    batchNumber: 'BATCH-001',
    manufacturer: 'Bayer',
    reportAnonymously: false,
    status: 'pending',
    timestamp: '2023-11-15T10:30:00Z',
    attachedImages: [
      { uri: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=IMG1', id: 'img1' },
      { uri: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=IMG2', id: 'img2' }
    ],
    userId: 'user123'
  },
  {
    id: '2',
    medicationName: 'Ibuprofen 200mg',
    description: 'Suspicious packaging, seal broken. The medication container appears to have been tampered with.',
    location: '456 Oak Ave, Anytown, NY',
    storeName: 'Walgreens',
    category: 'Over-the-Counter',
    severity: 'high',
    expirationDate: '2024-06-20',
    batchNumber: 'BATCH-002',
    manufacturer: 'Advil',
    reportAnonymously: true,
    status: 'under_review',
    timestamp: '2023-11-10T14:15:00Z',
    attachedImages: [
      { uri: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=IMG3', id: 'img3' }
    ],
    userId: 'user123'
  },
  {
    id: '3',
    medicationName: 'Amoxicillin 500mg',
    description: 'Wrong medication in the bottle. The label indicates one medication but contains different pills.',
    location: '789 Pine Ln, Anytown, NY',
    storeName: 'Rite Aid',
    category: 'Prescription Drugs',
    severity: 'critical',
    expirationDate: '2024-12-01',
    batchNumber: 'BATCH-003',
    manufacturer: 'Generic Pharma',
    reportAnonymously: false,
    status: 'resolved',
    timestamp: '2023-11-05T09:45:00Z',
    attachedImages: [],
    userId: 'user123'
  },
  {
    id: '4',
    medicationName: 'Vitamin D3 1000IU',
    description: 'Unusual taste and smell. The supplement has an off-putting odor and bitter taste.',
    location: '321 Elm St, Anytown, NY',
    storeName: 'GNC',
    category: 'Supplements',
    severity: 'low',
    expirationDate: '2025-03-15',
    batchNumber: 'BATCH-004',
    manufacturer: 'Nature Made',
    reportAnonymously: false,
    status: 'pending',
    timestamp: '2023-11-20T16:20:00Z',
    attachedImages: [
      { uri: 'https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=IMG4', id: 'img4' }
    ],
    userId: 'user123'
  }
];

const getStatusConfig = (theme) => ({
  pending: { 
    label: 'Pending', 
    color: '#ffc107', 
    icon: 'clock', 
    bgColor: theme === 'dark' ? 'rgba(255, 193, 7, 0.2)' : '#fff3cd' 
  },
  under_review: { 
    label: 'Under Review', 
    color: '#17a2b8', 
    icon: 'search', 
    bgColor: theme === 'dark' ? 'rgba(23, 162, 184, 0.2)' : '#d1ecf1' 
  },
  resolved: { 
    label: 'Resolved', 
    color: '#28a745', 
    icon: 'check-circle', 
    bgColor: theme === 'dark' ? 'rgba(40, 167, 69, 0.2)' : '#d4edda' 
  },
  rejected: { 
    label: 'Rejected', 
    color: '#dc3545', 
    icon: 'x-circle', 
    bgColor: theme === 'dark' ? 'rgba(220, 53, 69, 0.2)' : '#f8d7da' 
  }
});

const getSeverityConfig = (theme) => ({
  low: { label: 'Low', color: '#28a745', icon: 'alert-circle' },
  medium: { label: 'Medium', color: '#ffc107', icon: 'alert-triangle' },
  high: { label: 'High', color: '#fd7e14', icon: 'alert-octagon' },
  critical: { label: 'Critical', color: '#dc3545', icon: 'alert-octagon' }
});

const ReportCard = ({ report, onView, onEdit, onDelete, theme }) => {
  const [imageError, setImageError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#677583',
    borderColor: theme === 'dark' ? '#404040' : '#f1f2f4',
    cardBackground: theme === 'dark' ? '#1a1a1a' : '#ffffff'
  };

  const statusConfig = getStatusConfig(theme);
  const severityConfig = getSeverityConfig(theme);
  const status = statusConfig[report.status] || statusConfig.pending;
  const severity = severityConfig[report.severity] || severityConfig.medium;

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStatusBadge = () => (
    <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
      <Icon name={status.icon} size={12} color={status.color} />
      <Text style={[styles.statusText, { color: status.color }]}>
        {status.label}
      </Text>
    </View>
  );

  const renderSeverityBadge = () => (
    <View style={[styles.severityBadge, { borderColor: severity.color }]}>
      <Icon name={severity.icon} size={12} color={severity.color} />
      <Text style={[styles.severityText, { color: severity.color }]}>
        {severity.label}
      </Text>
    </View>
  );

  const renderImages = () => {
    if (!report.attachedImages || report.attachedImages.length === 0) {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="image" size={20} color={dynamicStyles.mutedText} />
          <Text style={[styles.noImageText, { color: dynamicStyles.mutedText }]}>
            No images
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imagesContainer}
      >
        {report.attachedImages.map((image, index) => (
          <TouchableOpacity key={image.id} onPress={() => onView(report)}>
            <Image 
              source={{ uri: image.uri }} 
              style={styles.reportImage}
              onError={() => setImageError(true)}
            />
            {index === 0 && report.attachedImages.length > 1 && (
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>+{report.attachedImages.length - 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.reportCard, 
        { 
          backgroundColor: dynamicStyles.backgroundColor,
          borderColor: dynamicStyles.borderColor,
          opacity: fadeAnim
        }
      ]}
    >
      {/* Header with Status and Severity */}
      <View style={styles.reportHeader}>
        <View style={styles.badgeContainer}>
          {renderStatusBadge()}
          {renderSeverityBadge()}
        </View>
        <Text style={[styles.timestamp, { color: dynamicStyles.mutedText }]}>
          {formatDate(report.timestamp)}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.reportContent}>
        <View style={styles.medicationSection}>
          <Text style={[styles.medicationName, { color: dynamicStyles.textColor }]}>
            {report.medicationName}
          </Text>
          <Text style={[styles.category, { color: dynamicStyles.mutedText }]}>
            {report.category}
          </Text>
        </View>

        <Text style={[styles.description, { color: dynamicStyles.textColor }]}>
          {report.description}
        </Text>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="map-pin" size={14} color={dynamicStyles.mutedText} />
            <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]} numberOfLines={1}>
              {report.location}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="shopping-bag" size={14} color={dynamicStyles.mutedText} />
            <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]} numberOfLines={1}>
              {report.storeName}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="calendar" size={14} color={dynamicStyles.mutedText} />
            <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]}>
              Exp: {new Date(report.expirationDate).toLocaleDateString()}
            </Text>
          </View>

          {report.batchNumber && (
            <View style={styles.detailItem}>
              <Icon name="hash" size={14} color={dynamicStyles.mutedText} />
              <Text style={[styles.detailText, { color: dynamicStyles.mutedText }]}>
                {report.batchNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Images */}
        {renderImages()}

        {/* Anonymous Indicator */}
        {report.reportAnonymously && (
          <View style={styles.anonymousIndicator}>
            <Icon name="eye-off" size={12} color={dynamicStyles.mutedText} />
            <Text style={[styles.anonymousText, { color: dynamicStyles.mutedText }]}>
              Anonymous Report
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]} 
          onPress={() => onView(report)}
        >
          <Icon name="eye" size={16} color="#197ce5" />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit(report)}
        >
          <Icon name="edit" size={16} color="#ffc107" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Icon name="trash-2" size={16} color="#dc3545" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const ReportedScreen = () => {
  const [reports, setReports] = useState(sampleReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#677583',
    borderColor: theme === 'dark' ? '#404040' : '#f1f2f4',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff'
  };

  // Filter and search reports
  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = searchQuery === '' || 
        report.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity;
      const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
    });

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [reports, searchQuery, selectedStatus, selectedSeverity, selectedCategory]);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => 
    [...new Set(reports.map(report => report.category))], [reports]
  );

  const uniqueStatuses = useMemo(() => 
    [...new Set(reports.map(report => report.status))], [reports]
  );

  const uniqueSeverities = useMemo(() => 
    [...new Set(reports.map(report => report.severity))], [reports]
  );

  // Get status config for the main component
  const statusConfig = useMemo(() => getStatusConfig(theme), [theme]);

  useEffect(() => {
    // Handle navigation from ReportFormScreen
    if (route.params?.newReport) {
      // Simulate adding a new report
      const newReport = {
        id: Date.now().toString(),
        medicationName: route.params.medicationName || 'New Medication',
        description: route.params.description || 'New report description',
        location: route.params.location || 'Location not specified',
        storeName: route.params.storeName || 'Store not specified',
        category: route.params.category || 'Other',
        severity: route.params.severity || 'medium',
        expirationDate: route.params.expirationDate || new Date().toISOString(),
        batchNumber: route.params.batchNumber || '',
        manufacturer: route.params.manufacturer || '',
        reportAnonymously: route.params.reportAnonymously || false,
        status: 'pending',
        timestamp: new Date().toISOString(),
        attachedImages: route.params.attachedImages || [],
        userId: user?.id || 'user123'
      };
      
      setReports(prev => [newReport, ...prev]);
      
      // Clear navigation params
      navigation.setParams({ newReport: undefined });
    }
  }, [route.params, navigation, user]);

  const handleDelete = (reportId) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setReports(prev => prev.filter(r => r.id !== reportId));
            Alert.alert('Success', 'Report deleted successfully.');
          }
        }
      ]
    );
  };

  const handleEdit = (report) => {
    navigation.navigate('EditMyReports', { report, user });
  };

  const handleView = (report) => {
    navigation.navigate('ReportDetail', { report, user });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedSeverity('all');
    setSelectedCategory('all');
  };

  const renderFilters = () => (
    <View style={[styles.filtersContainer, { backgroundColor: dynamicStyles.cardBackground }]}>
      <View style={styles.filterHeader}>
        <Text style={[styles.filterTitle, { color: dynamicStyles.textColor }]}>Filters</Text>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={[styles.clearFiltersText, { color: '#197ce5' }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: dynamicStyles.textColor }]}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedStatus === 'all' ? '#197ce5' : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedStatus === 'all' ? '#ffffff' : dynamicStyles.textColor }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {uniqueStatuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedStatus === status ? '#197ce5' : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedStatus === status ? '#ffffff' : dynamicStyles.textColor }
              ]}>
                {statusConfig[status]?.label || status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Severity Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: dynamicStyles.textColor }]}>Severity</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedSeverity === 'all' ? '#197ce5' : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedSeverity('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedSeverity === 'all' ? '#ffffff' : dynamicStyles.textColor }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {uniqueSeverities.map(severity => (
            <TouchableOpacity
              key={severity}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedSeverity === severity ? '#197ce5' : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedSeverity(severity)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedSeverity === severity ? '#ffffff' : dynamicStyles.textColor }
              ]}>
                {severityConfig[severity]?.label || severity}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: dynamicStyles.textColor }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedCategory === 'all' ? '#197ce5' : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedCategory === 'all' ? '#ffffff' : dynamicStyles.textColor }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {uniqueCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedCategory === category ? '#197ce5' : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedCategory === category ? '#ffffff' : dynamicStyles.textColor }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="file-text" size={64} color={dynamicStyles.mutedText} />
      <Text style={[styles.emptyStateTitle, { color: dynamicStyles.textColor }]}>
        No Reports Found
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: dynamicStyles.mutedText }]}>
        {searchQuery || selectedStatus !== 'all' || selectedSeverity !== 'all' || selectedCategory !== 'all'
          ? 'Try adjusting your filters or search terms'
          : 'Start by creating your first medication report'
        }
      </Text>
      <TouchableOpacity
        style={[styles.emptyStateButton, { backgroundColor: '#197ce5' }]}
        onPress={() => navigation.navigate('ReportForm')}
      >
        <Text style={styles.emptyStateButtonText}>Create Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>My Reported Issues</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.filterToggleButton} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icon 
              name={showFilters ? "x" : "filter"} 
              size={20} 
              color={showFilters ? dynamicStyles.textColor : '#197ce5'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: dynamicStyles.inputBackground }]}>
          <Icon name="search" size={20} color={dynamicStyles.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.textColor }]}
            placeholder="Search your reports..."
            placeholderTextColor={dynamicStyles.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={20} color={dynamicStyles.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Reports Count */}
      <View style={styles.reportsCountContainer}>
        <Text style={[styles.reportsCount, { color: dynamicStyles.mutedText }]}>
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Reports List */}
      <ScrollView 
        style={styles.reportsList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#197ce5']}
            tintColor={theme === 'dark' ? '#ffffff' : '#197ce5'}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredReports.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={() => handleEdit(report)}
              onDelete={() => handleDelete(report.id)}
              onView={() => handleView(report)}
              theme={theme}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ReportForm')}
      >
        <Icon name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 0,
    paddingRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    paddingTop: 20,
    paddingRight: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterToggleButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ed',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ed',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reportsCountContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  reportsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  reportsList: { 
    flex: 1 
  },
  reportCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f2f4',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
  },
  reportContent: {
    padding: 16,
  },
  medicationSection: {
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsGrid: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reportImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noImageText: {
    fontSize: 10,
    marginTop: 4,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageCountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  anonymousIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  anonymousText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f4',
    paddingTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#e3f2fd',
  },
  viewButtonText: {
    color: '#197ce5',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#fff8e1',
  },
  editButtonText: {
    color: '#ffc107',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
