import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  Alert,
  Modal,
  Dimensions,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const alertTypes = [
  { name: 'All', icon: 'grid', count: 0, color: '#197ce5' },
  { name: 'Critical', icon: 'alert-triangle', count: 3, color: '#ef4444' },
  { name: 'Warning', icon: 'alert-circle', count: 5, color: '#f59e0b' },
  { name: 'Info', icon: 'info', count: 8, color: '#3b82f6' },
  { name: 'Success', icon: 'check-circle', count: 2, color: '#10b981' }
];

const priorityLevels = [
  { name: 'All', color: '#197ce5' },
  { name: 'High', color: '#ef4444' },
  { name: 'Medium', color: '#f59e0b' },
  { name: 'Low', color: '#10b981' }
];

const alertsData = [
  {
    id: 1,
    title: 'Critical: Medication Recall - Batch #RX2024-001',
    description: 'Immediate recall of specific medication batch due to contamination concerns. Stop use immediately.',
    time: '10:30 AM',
    date: 'Today',
    type: 'Critical',
    priority: 'High',
    category: 'Safety',
    isRead: false,
    isArchived: false,
    actionRequired: true,
    source: 'FDA',
    affectedMedications: ['Medication A', 'Medication B'],
    instructions: 'Return to pharmacy, do not consume, contact healthcare provider'
  },
  {
    id: 2,
    title: 'Warning: Expired Medication Detected',
    description: 'Multiple expired medications found in nearby pharmacies. Check your medications.',
    time: '2:15 PM',
    date: 'Today',
    type: 'Warning',
    priority: 'Medium',
    category: 'Safety',
    isRead: false,
    isArchived: false,
    actionRequired: true,
    source: 'Local Health Authority',
    affectedMedications: ['Various'],
    instructions: 'Check expiration dates, report expired medications'
  },
  {
    id: 3,
    title: 'Info: New Medication Safety Guidelines',
    description: 'Updated guidelines for safe medication storage and disposal practices.',
    time: '3:45 PM',
    date: 'Today',
    type: 'Info',
    priority: 'Low',
    category: 'Education',
    isRead: true,
    isArchived: false,
    actionRequired: false,
    source: 'CDC',
    affectedMedications: [],
    instructions: 'Review new guidelines, update practices'
  },
  {
    id: 4,
    title: 'Success: Medication Verification Complete',
    description: 'Your reported medication has been verified and is safe for use.',
    time: '9:00 AM',
    date: 'Yesterday',
    type: 'Success',
    priority: 'Low',
    category: 'Verification',
    isRead: true,
    isArchived: false,
    actionRequired: false,
    source: 'MedAlert System',
    affectedMedications: ['Reported Medication'],
    instructions: 'Continue using as prescribed'
  },
  {
    id: 5,
    title: 'Warning: Suspicious Medication Report',
    description: 'Report of counterfeit medication in your area. Be vigilant.',
    time: '11:45 AM',
    date: 'Yesterday',
    type: 'Warning',
    priority: 'High',
    category: 'Safety',
    isRead: false,
    isArchived: false,
    actionRequired: true,
    source: 'Local Pharmacy',
    affectedMedications: ['Generic Brand X'],
    instructions: 'Verify medication authenticity, report suspicious items'
  },
  {
    id: 6,
    title: 'Info: Reminder - Check Medication Expiry Dates',
    description: 'Monthly reminder to review and check expiration dates of all medications.',
    time: '5:30 PM',
    date: 'Yesterday',
    type: 'Info',
    priority: 'Medium',
    category: 'Reminder',
    isRead: true,
    isArchived: false,
    actionRequired: false,
    source: 'MedAlert System',
    affectedMedications: ['All Medications'],
    instructions: 'Review medication cabinet, dispose of expired items'
  },
  {
    id: 7,
    title: 'Critical: Drug Interaction Alert',
    description: 'Potential dangerous interaction detected with your current medications.',
    time: '8:15 AM',
    date: '2 days ago',
    type: 'Critical',
    priority: 'High',
    category: 'Safety',
    isRead: false,
    isArchived: false,
    actionRequired: true,
    source: 'Pharmacy System',
    affectedMedications: ['Medication C', 'Medication D'],
    instructions: 'Contact healthcare provider immediately, do not take together'
  },
  {
    id: 8,
    title: 'Info: New Safety Features Available',
    description: 'Enhanced medication safety features now available in the MedAlert app.',
    time: '1:20 PM',
    date: '2 days ago',
    type: 'Info',
    priority: 'Low',
    category: 'App Update',
    isRead: true,
    isArchived: false,
    actionRequired: false,
    source: 'MedAlert Team',
    affectedMedications: [],
    instructions: 'Explore new features, update app if needed'
  }
];

export const AlertsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState(alertsData);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'priority', 'type', 'unread'
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#677583',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
    secondaryColor: theme === 'dark' ? '#4a4a4a' : '#f8f9fa',
  };

  // 👇 This hides the default header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Filter alerts by type, priority, search, and other criteria
  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = selectedType === 'All' || alert.type === selectedType;
    const matchesPriority = selectedPriority === 'All' || alert.priority === selectedPriority;
    const matchesSearch = alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         alert.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesUnread = !showUnreadOnly || !alert.isRead;
    const matchesArchived = showArchived ? alert.isArchived : !alert.isArchived;
    
    return matchesType && matchesPriority && matchesSearch && matchesUnread && matchesArchived;
  });

  // Sort alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'type':
        const typeOrder = { 'Critical': 1, 'Warning': 2, 'Info': 3, 'Success': 4 };
        return typeOrder[a.type] - typeOrder[b.type];
      case 'unread':
        return (b.isRead ? 0 : 1) - (a.isRead ? 0 : 1);
      case 'recent':
      default:
        return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleAlertPress = (alert) => {
    // Mark as read
    setAlerts(prev => 
      prev.map(item => 
        item.id === alert.id ? { ...item, isRead: true } : item
      )
    );
    
    // Show alert details
    Alert.alert(
      alert.title,
      alert.description,
      [
        { text: 'Close', style: 'default' },
        { text: 'Take Action', style: 'default', onPress: () => handleTakeAction(alert) }
      ]
    );
  };

  const handleTakeAction = (alert) => {
    Alert.alert(
      'Action Required',
      `Instructions: ${alert.instructions}`,
      [
        { text: 'Mark Complete', style: 'default', onPress: () => markActionComplete(alert.id) },
        { text: 'Remind Later', style: 'default' }
      ]
    );
  };

  const markActionComplete = (alertId) => {
    setAlerts(prev => 
      prev.map(item => 
        item.id === alertId ? { ...item, actionRequired: false } : item
      )
    );
    Alert.alert('Success', 'Action marked as complete');
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => 
      prev.map(item => ({ ...item, isRead: true }))
    );
    Alert.alert('Success', 'All alerts marked as read');
  };

  const handleArchiveAlert = (alertId) => {
    setAlerts(prev => 
      prev.map(item => 
        item.id === alertId ? { ...item, isArchived: true } : item
      )
    );
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Critical': return 'alert-triangle';
      case 'Warning': return 'alert-circle';
      case 'Info': return 'info';
      case 'Success': return 'check-circle';
      default: return 'bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'Critical': return '#ef4444';
      case 'Warning': return '#f59e0b';
      case 'Info': return '#3b82f6';
      case 'Success': return '#10b981';
      default: return '#197ce5';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#197ce5';
    }
  };

  const renderTypeFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.typeContainer, { backgroundColor: dynamicStyles.secondaryColor }]}
      contentContainerStyle={styles.typeContent}
    >
      {alertTypes.map((type, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.typeButton,
            { backgroundColor: dynamicStyles.cardBackground },
            selectedType === type.name && { backgroundColor: type.color }
          ]}
          onPress={() => handleTypeSelect(type.name)}
        >
          <Icon 
            name={type.icon} 
            size={16} 
            color={selectedType === type.name ? '#fff' : type.color} 
          />
          <Text style={[
            styles.typeButtonText,
            selectedType === type.name && { color: '#fff' }
          ]}>
            {type.name}
          </Text>
          <View style={[
            styles.typeCount,
            selectedType === type.name && { backgroundColor: 'rgba(255,255,255,0.2)' }
          ]}>
            <Text style={[
              styles.typeCountText,
              selectedType === type.name && { color: '#fff' }
            ]}>
              {type.count}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPriorityFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.priorityContainer, { backgroundColor: dynamicStyles.secondaryColor }]}
      contentContainerStyle={styles.priorityContent}
    >
      {priorityLevels.map((priority, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.priorityButton,
            { backgroundColor: dynamicStyles.cardBackground },
            selectedPriority === priority.name && { backgroundColor: priority.color }
          ]}
          onPress={() => handlePrioritySelect(priority.name)}
        >
          <Text style={[
            styles.priorityButtonText,
            selectedPriority === priority.name && { color: '#fff' }
          ]}>
            {priority.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSortButtons = () => (
    <View style={[styles.sortContainer, { backgroundColor: dynamicStyles.secondaryColor }]}>
      <Text style={[styles.sortLabel, { color: dynamicStyles.mutedText }]}>Sort by:</Text>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'recent' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('recent')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'recent' && { color: '#fff' }]}>Recent</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'priority' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('priority')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'priority' && { color: '#fff' }]}>Priority</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'unread' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('unread')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'unread' && { color: '#fff' }]}>Unread</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAlertCard = (alert) => (
    <TouchableOpacity
      key={alert.id}
      style={[
        styles.alertItem, 
        { 
          backgroundColor: dynamicStyles.cardBackground,
          borderBottomColor: dynamicStyles.borderColor,
          opacity: alert.isRead ? 0.8 : 1
        }
      ]}
      onPress={() => handleAlertPress(alert)}
    >
      <View style={[styles.alertIconContainer, { backgroundColor: getAlertColor(alert.type) + '20' }]}>
        <Icon name={getAlertIcon(alert.type)} size={24} color={getAlertColor(alert.type)} />
      </View>
      
      <View style={styles.alertTextContainer}>
        <View style={styles.alertHeader}>
          <Text style={[styles.alertTitle, { color: dynamicStyles.textColor }]} numberOfLines={2}>
            {alert.title}
          </Text>
          {!alert.isRead && <View style={styles.unreadIndicator} />}
        </View>
        
        <Text style={[styles.alertDescription, { color: dynamicStyles.mutedText }]} numberOfLines={2}>
          {alert.description}
        </Text>
        
        <View style={styles.alertMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(alert.priority) }]}>
              {alert.priority}
            </Text>
          </View>
          <Text style={[styles.categoryText, { color: dynamicStyles.primaryColor }]}>
            {alert.category}
          </Text>
          <Text style={[styles.sourceText, { color: dynamicStyles.mutedText }]}>
            {alert.source}
          </Text>
        </View>
        
        <View style={styles.alertFooter}>
          <Text style={[styles.alertTime, { color: dynamicStyles.mutedText }]}>
            {alert.date} • {alert.time}
          </Text>
          {alert.actionRequired && (
            <View style={styles.actionRequiredBadge}>
              <Text style={styles.actionRequiredText}>Action Required</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.alertActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleArchiveAlert(alert.id)}
        >
          <Icon name="archive" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>
        <Icon name="chevron-right" size={24} color={dynamicStyles.mutedText} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: dynamicStyles.secondaryColor }]}>
      <Icon name="bell-off" size={48} color={dynamicStyles.mutedText} />
      <Text style={[styles.emptyStateText, { color: dynamicStyles.textColor }]}>
        No alerts found
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: dynamicStyles.mutedText }]}>
        Try adjusting your filters or search terms
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Alerts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleMarkAllRead}>
            <Icon name="check" size={20} color={dynamicStyles.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            <Icon 
              name={showUnreadOnly ? "eye-off" : "eye"} 
              size={20} 
              color={showUnreadOnly ? dynamicStyles.primaryColor : dynamicStyles.mutedText} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: dynamicStyles.secondaryColor }]}>
          <Icon name="search" size={20} color={dynamicStyles.mutedText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.textColor }]}
            placeholder="Search alerts..."
            placeholderTextColor={dynamicStyles.mutedText}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="x" size={20} color={dynamicStyles.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type Filters */}
      {renderTypeFilters()}

      {/* Priority Filters */}
      {renderPriorityFilters()}

      {/* Sort Options */}
      {renderSortButtons()}

      {/* Alerts List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[dynamicStyles.primaryColor]}
            tintColor={dynamicStyles.primaryColor}
          />
        }
      >
        {sortedAlerts.length === 0 ? (
          renderEmptyState()
        ) : (
          sortedAlerts.map(renderAlertCard)
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={[styles.footer, { backgroundColor: dynamicStyles.backgroundColor, borderTopColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Report')}>
          <Icon name="file-plus" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell" size={24} color={dynamicStyles.primaryColor} /> 
          <Text style={[styles.footerButtonText, { color: dynamicStyles.primaryColor }]}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Education</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
          <Icon name="users" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Forum</Text>
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
    paddingTop: 60,
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
    fontSize: 18,
    color: '#111418',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#111418' 
  },
  scrollView: {
    flex: 1,
  },
  typeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  typeContent: {
    alignItems: 'center',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f2f4',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  typeCount: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  typeCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#637588',
  },
  priorityContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  priorityContent: {
    alignItems: 'center',
  },
  priorityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f2f4',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#637588',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sortLabel: {
    fontSize: 14,
    color: '#637588',
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#637588',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f4',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111418',
    flex: 1,
    marginRight: 8,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#197ce5',
  },
  alertDescription: {
    fontWeight: '400',
    fontSize: 14,
    color: '#637588',
    marginBottom: 12,
    lineHeight: 20,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#197ce5',
    marginRight: 8,
    marginBottom: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#637588',
    marginBottom: 4,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertTime: {
    fontWeight: '400',
    fontSize: 12,
    color: '#637588',
  },
  actionRequiredBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionRequiredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  alertActions: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginHorizontal: 16,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#637588',
    marginTop: 5,
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
