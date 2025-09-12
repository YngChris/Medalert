import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { reportsStorage } from '../utils/reportsStorage';

const { width } = Dimensions.get('window');

// No hardcoded data - reports will be loaded from storage

const getStatusConfig = (dynamicStyles) => ({
  pending: { 
    label: 'Pending', 
    color: dynamicStyles.warningColor, 
    icon: 'clock', 
    bgColor: dynamicStyles.warningBackground 
  },
  under_review: { 
    label: 'Under Review', 
    color: dynamicStyles.primaryColor, 
    icon: 'search', 
    bgColor: dynamicStyles.primaryColor + '20' 
  },
  resolved: { 
    label: 'Resolved', 
    color: dynamicStyles.successColor, 
    icon: 'check-circle', 
    bgColor: dynamicStyles.successBackground 
  },
  rejected: { 
    label: 'Rejected', 
    color: dynamicStyles.errorColor, 
    icon: 'x-circle', 
    bgColor: dynamicStyles.errorBackground 
  }
});

const getSeverityConfig = (dynamicStyles) => ({
  low: { label: 'Low', color: dynamicStyles.successColor, icon: 'alert-circle' },
  medium: { label: 'Medium', color: dynamicStyles.warningColor, icon: 'alert-triangle' },
  high: { label: 'High', color: dynamicStyles.warningColor, icon: 'alert-octagon' },
  critical: { label: 'Critical', color: dynamicStyles.errorColor, icon: 'alert-octagon' }
});

const EnhancedReportItem = ({ report, onEdit, onDelete, onView, dynamicStyles }) => {
  const [imageError, setImageError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const statusConfig = useMemo(() => getStatusConfig(dynamicStyles), [dynamicStyles]);
  const severityConfig = useMemo(() => getSeverityConfig(dynamicStyles), [dynamicStyles]);
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
        styles.reportItem, 
        { 
          backgroundColor: dynamicStyles.backgroundColor,
          borderBottomColor: dynamicStyles.borderColor,
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
          <Icon name="eye" size={16} color={dynamicStyles.primaryColor} />
          <Text style={[styles.viewButtonText, { color: dynamicStyles.primaryColor }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit(report)}
        >
          <Icon name="edit" size={16} color={dynamicStyles.warningColor} />
          <Text style={[styles.editButtonText, { color: dynamicStyles.warningColor }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Icon name="trash-2" size={16} color={dynamicStyles.errorColor} />
          <Text style={[styles.deleteButtonText, { color: dynamicStyles.errorColor }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const MyReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [deletedReports, setDeletedReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const lastDeletedReport = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { getThemeColors } = useTheme();
  const { user } = useAuth();
  const dynamicStyles = getThemeColors();

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

  // Load reports from storage
  const loadReports = async () => {
    try {
      setIsLoading(true);
      const userId = user?.id || 'user123';
      console.log('🔍 MyReportsScreen: Loading reports for user:', user);
      console.log('🔍 MyReportsScreen: Using userId:', userId);
      const storedReports = await reportsStorage.getReports(userId);
      console.log('📊 MyReportsScreen: Loaded reports:', storedReports);
      setReports(storedReports);
    } catch (error) {
      console.error('❌ MyReportsScreen: Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load deleted reports from storage
  const loadDeletedReports = async () => {
    try {
      const deleted = await reportsStorage.getDeletedReports();
      setDeletedReports(deleted);
    } catch (error) {
      console.error('Error loading deleted reports:', error);
    }
  };

  useEffect(() => {
    loadReports();
    loadDeletedReports();
  }, [user]);

  // Handle focus event to reload reports when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadReports();
      loadDeletedReports();
    });

    return unsubscribe;
  }, [navigation, user]);

  const handleDelete = async (reportId) => {
    const reportIndex = reports.findIndex(r => r.id === reportId);
    const deleted = reports[reportIndex];
    lastDeletedReport.current = { ...deleted, index: reportIndex };
    
    try {
      // Remove from main storage
      await reportsStorage.deleteReport(reportId);
      
      // Save to deleted reports storage
      await reportsStorage.saveDeletedReport(deleted);
      
      setDeletedReports(prev => [...prev, deleted]);
      setReports(prev => prev.filter(r => r.id !== reportId));

      Toast.show({
        type: 'info',
        text1: 'Report deleted successfully',
        text2: 'Tap to undo',
        onPress: () => handleUndo(),
        visibilityTime: 5000,
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      Alert.alert('Error', 'Failed to delete report. Please try again.');
    }
  };

  const handleUndo = async () => {
    const { index, ...report } = lastDeletedReport.current || {};
    if (report && typeof index === 'number') {
      try {
        // Restore to storage with original ID and data
        await reportsStorage.restoreReport(report);
        
        // Remove from deleted reports storage
        await reportsStorage.removeDeletedReport(report.id);
        
        // Reload reports from storage to avoid duplicates
        await loadReports();

        setDeletedReports(prev =>
          prev.filter(item => item.id !== report.id)
        );

        lastDeletedReport.current = null;
        Toast.hide();
      } catch (error) {
        console.error('Error restoring report:', error);
        Alert.alert('Error', 'Failed to restore report. Please try again.');
      }
    }
  };

  const handleEdit = (report) => {
    navigation.navigate('EditMyReports', { report, user });
  };

  const handleView = (report) => {
    navigation.navigate('ReportDetail', { report, user });
  };

  const goToRecycleBin = () => {
    navigation.navigate('RecycleBin', { 
      deletedReports,
      // Pass a callback ID instead of the function directly
      onRestore: 'restoreFromBin'
    });
  };

  // Handle restore callback from RecycleBin screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reload reports when returning from RecycleBin
      loadReports();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadReports();
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
          <Text style={[styles.clearFiltersText, { color: dynamicStyles.primaryColor }]}>Clear All</Text>
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
                backgroundColor: selectedStatus === 'all' ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedStatus === 'all' ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
                  backgroundColor: selectedStatus === status ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedStatus === status ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
                backgroundColor: selectedSeverity === 'all' ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedSeverity('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedSeverity === 'all' ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
                  backgroundColor: selectedSeverity === severity ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedSeverity(severity)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedSeverity === severity ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
                backgroundColor: selectedCategory === 'all' ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.filterChipText,
              { color: selectedCategory === 'all' ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
                  backgroundColor: selectedCategory === category ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.filterChipText,
                { color: selectedCategory === category ? dynamicStyles.whiteColor : dynamicStyles.textColor }
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
        style={[styles.emptyStateButton, { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => navigation.navigate('ReportForm')}
      >
        <Text style={[styles.emptyStateButtonText, { color: dynamicStyles.buttonText }]}>Create Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>My Reports</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterToggleButton} 
              onPress={() => setShowFilters(!showFilters)}
            >
              <Icon 
                name={showFilters ? "x" : "filter"} 
                size={20} 
                color={showFilters ? dynamicStyles.textColor : dynamicStyles.primaryColor} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={goToRecycleBin}>
              <Icon name="trash-2" size={22} color={dynamicStyles.errorColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: dynamicStyles.inputBackground }]}>
            <Icon name="search" size={20} color={dynamicStyles.mutedText} />
            <TextInput
              style={[styles.searchInput, { color: dynamicStyles.textColor }]}
              placeholder="Search reports..."
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
              colors={[dynamicStyles.primaryColor]}
              tintColor={dynamicStyles.primaryColor}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {(() => {
            console.log('🎯 MyReportsScreen Render Debug:');
            console.log('📊 Total reports:', reports.length);
            console.log('📊 Filtered reports:', filteredReports.length);
            console.log('📊 Is loading:', isLoading);
            console.log('📊 Search query:', searchQuery);
            console.log('📊 Selected status:', selectedStatus);
            console.log('📊 Selected severity:', selectedSeverity);
            console.log('📊 Selected category:', selectedCategory);
            if (reports.length > 0) {
              console.log('📊 Sample report:', reports[0]);
            }
            return null;
          })()}
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={dynamicStyles.primaryColor} />
              <Text style={[styles.loadingText, { color: dynamicStyles.mutedText }]}>
                Loading reports...
              </Text>
            </View>
          ) : filteredReports.length === 0 ? (
            renderEmptyState()
          ) : (
            filteredReports.map((report) => (
              <EnhancedReportItem
                key={report.id}
                report={report}
                onEdit={() => handleEdit(report)}
                onDelete={() => handleDelete(report.id)}
                onView={() => handleView(report)}
                dynamicStyles={dynamicStyles}
              />
            ))
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: dynamicStyles.primaryColor }]}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <Icon name="plus" size={24} color={dynamicStyles.buttonText} />
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      <View style={[styles.footer, { backgroundColor: dynamicStyles.backgroundColor, borderTopColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
          onPress={() => navigation.navigate('MyReports')}>
          <Icon name="file-plus" size={24} color={dynamicStyles.primaryColor} />
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive, { color: dynamicStyles.primaryColor }]}>
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Locations</Text>
        </TouchableOpacity>

      </View>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1
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
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  reportItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
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
    backgroundColor: 'transparent',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonActive: {},
  footerButtonTextActive: {
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
