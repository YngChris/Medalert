import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const initialDiscussions = [
  { 
    id: 1, 
    title: 'New Guidelines on Antibiotic Use', 
    author: 'Dr. Amelia Harper', 
    time: '2 days ago', 
    isNew: true, 
    upvotes: 24, 
    downvotes: 2,
    replies: 8,
    category: 'Medical Guidelines',
    content: 'The FDA has released new guidelines for antibiotic use. This is crucial for preventing antibiotic resistance...',
    tags: ['antibiotics', 'guidelines', 'FDA']
  },
  { 
    id: 2, 
    title: 'Experiences with Generic Medications', 
    author: 'Ethan Bennett', 
    time: '4 days ago', 
    isNew: false, 
    upvotes: 15, 
    downvotes: 1,
    replies: 12,
    category: 'Personal Experience',
    content: 'I recently switched to generic versions of my medications and noticed some differences...',
    tags: ['generic', 'medications', 'experience']
  },
  { 
    id: 3, 
    title: 'Managing Side Effects of Common Drugs', 
    author: 'Sophia Carter', 
    time: '1 week ago', 
    isNew: false, 
    upvotes: 31, 
    downvotes: 3,
    replies: 18,
    category: 'Health Tips',
    content: 'Here are some effective ways to manage common side effects from medications...',
    tags: ['side effects', 'management', 'tips']
  },
  { 
    id: 4, 
    title: 'Safe Disposal of Expired Medications', 
    author: 'Dr. Marcus Chen', 
    time: '3 days ago', 
    isNew: true, 
    upvotes: 42, 
    downvotes: 0,
    replies: 6,
    category: 'Safety',
    content: 'Proper disposal of expired medications is essential for environmental safety...',
    tags: ['disposal', 'expired', 'environment']
  },
  { 
    id: 5, 
    title: 'Understanding Drug Interactions', 
    author: 'Nurse Sarah Wilson', 
    time: '5 days ago', 
    isNew: false, 
    upvotes: 28, 
    downvotes: 2,
    replies: 14,
    category: 'Education',
    content: 'Many people don\'t realize how common drug interactions can be...',
    tags: ['interactions', 'education', 'safety']
  }
];

const trendingTopics = [
  { title: 'Safe Disposal of Medications', posts: 120, isNew: true, category: 'Safety' },
  { title: 'Understanding Drug Interactions', posts: 85, isNew: false, category: 'Education' },
  { title: 'Finding Affordable Alternatives', posts: 60, isNew: true, category: 'Cost' },
  { title: 'Natural Remedies vs Prescription Drugs', posts: 95, isNew: true, category: 'Alternative Medicine' },
  { title: 'Medication Storage Best Practices', posts: 45, isNew: false, category: 'Safety' }
];

const categories = [
  { name: 'All', icon: 'grid', count: 0 },
  { name: 'Medical Guidelines', icon: 'file-text', count: 12 },
  { name: 'Personal Experience', icon: 'user', count: 28 },
  { name: 'Health Tips', icon: 'lightbulb', count: 19 },
  { name: 'Safety', icon: 'shield', count: 15 },
  { name: 'Education', icon: 'book-open', count: 23 },
  { name: 'Cost', icon: 'dollar-sign', count: 8 },
  { name: 'Alternative Medicine', icon: 'leaf', count: 11 }
];

export const ForumScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('General');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'newest'
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637588',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
    secondaryColor: theme === 'dark' ? '#4a4a4a' : '#f8f9fa',
  };

  // Filter discussions by category and search
  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         d.content.toLowerCase().includes(searchText.toLowerCase()) ||
                         d.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort discussions
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'newest':
        return new Date(b.time) - new Date(a.time);
      case 'recent':
      default:
        return new Date(b.time) - new Date(a.time);
    }
  });

  // Filter trending topics
  const filteredTrendingTopics = trendingTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTopicPress = (discussion) => {
    navigation.navigate('Discussions', { discussion });
  };

  const handleAddTopic = () => {
    setShowNewTopicModal(true);
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    const newTopic = {
      id: Date.now(),
      title: newTopicTitle.trim(),
      content: newTopicContent.trim(),
      category: newTopicCategory,
      author: 'Current User',
      time: 'Just now',
      isNew: true,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      tags: newTopicTitle.toLowerCase().split(' ').filter(word => word.length > 2)
    };

    setDiscussions(prev => [newTopic, ...prev]);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicCategory('General');
    setShowNewTopicModal(false);
    Alert.alert('Success', 'New topic created successfully!');
  };

  const handleUpvote = (id) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
  };

  const handleDownvote = (id) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, downvotes: d.downvotes + 1 } : d))
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const renderSortButtons = () => (
    <View style={[styles.sortContainer, { 
      backgroundColor: dynamicStyles.secondaryColor, 
      borderBottomColor: dynamicStyles.borderColor 
    }]}>
      <Text style={[styles.sortLabel, { color: dynamicStyles.mutedText }]}>Sort by:</Text>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'recent' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('recent')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'recent' && { color: '#fff' }]}>Recent</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'popular' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('popular')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'popular' && { color: '#fff' }]}>Popular</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.sortButton, sortBy === 'newest' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('newest')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'newest' && { color: '#fff' }]}>Newest</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.categoriesContainer, { 
        backgroundColor: dynamicStyles.secondaryColor, 
        borderBottomColor: dynamicStyles.borderColor 
      }]}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            { backgroundColor: dynamicStyles.cardBackground },
            selectedCategory === category.name && { backgroundColor: dynamicStyles.primaryColor }
          ]}
          onPress={() => handleCategorySelect(category.name)}
        >
          <Icon 
            name={category.icon} 
            size={16} 
            color={selectedCategory === category.name ? '#fff' : dynamicStyles.textColor} 
          />
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category.name && { color: '#fff' }
          ]}>
            {category.name}
          </Text>
          {category.count > 0 && (
            <View style={[
              styles.categoryCount,
              selectedCategory === category.name && { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}>
              <Text style={[
                styles.categoryCountText,
                selectedCategory === category.name && { color: '#fff' }
              ]}>
                {category.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Community Forum</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTopic}>
          <Icon name="plus" size={24} color={dynamicStyles.primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: dynamicStyles.secondaryColor }]}>
          <Icon name="search" size={20} color={dynamicStyles.mutedText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.textColor }]}
            placeholder="Search topics, content, or tags..."
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

      {renderCategories()}
      {renderSortButtons()}

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[dynamicStyles.primaryColor]}
            tintColor={dynamicStyles.primaryColor}
          />
        }
      >
        <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>Trending Topics</Text>
        {filteredTrendingTopics.map((topic, index) => (
          <TouchableOpacity key={index} onPress={() => handleTopicPress(topic)}>
            <View style={[styles.topicItem, { backgroundColor: dynamicStyles.cardBackground, borderBottomColor: dynamicStyles.borderColor }]}>
              <View style={[styles.topicIconContainer, { backgroundColor: dynamicStyles.secondaryColor }]}>
                <Icon name="trending-up" size={20} color={dynamicStyles.primaryColor} />
              </View>
              <View style={styles.topicTextContainer}>
                <Text style={[styles.topicTitle, { color: dynamicStyles.textColor }]} numberOfLines={1}>{topic.title}</Text>
                <Text style={[styles.topicPosts, { color: dynamicStyles.mutedText }]}>{topic.posts} posts</Text>
                <Text style={[styles.topicCategory, { color: dynamicStyles.primaryColor }]}>{topic.category}</Text>
              </View>
              {topic.isNew && <View style={styles.badge}><Text style={styles.badgeText}>New</Text></View>}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24, color: dynamicStyles.textColor }]}>
          {selectedCategory === 'All' ? 'All Discussions' : `${selectedCategory} Discussions`}
        </Text>
        {sortedDiscussions.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: dynamicStyles.secondaryColor }]}>
            <Icon name="message-circle" size={48} color={dynamicStyles.mutedText} />
            <Text style={[styles.emptyStateText, { color: dynamicStyles.textColor }]}>
              No discussions found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: dynamicStyles.mutedText }]}>
              Try adjusting your search or category filter
            </Text>
          </View>
        ) : (
          sortedDiscussions.map((discussion) => (
            <TouchableOpacity key={discussion.id} onPress={() => handleTopicPress(discussion)}>
              <View style={[styles.topicItem, { backgroundColor: dynamicStyles.cardBackground, borderBottomColor: dynamicStyles.borderColor }]}>
                <View style={[styles.topicIconContainer, { backgroundColor: dynamicStyles.secondaryColor }]}>
                  <Icon name="hash" size={20} color={dynamicStyles.primaryColor} />
                </View>
                <View style={styles.topicTextContainer}>
                  <Text style={[styles.topicTitle, { color: dynamicStyles.textColor }]} numberOfLines={1}>
                    {discussion.title}
                  </Text>
                  <Text style={[styles.topicContent, { color: dynamicStyles.mutedText }]} numberOfLines={2}>
                    {discussion.content}
                  </Text>
                  <Text style={[styles.topicPosts, { color: dynamicStyles.mutedText }]}>
                    By {discussion.author} · {discussion.time}
                  </Text>
                  <Text style={[styles.topicCategory, { color: dynamicStyles.primaryColor }]}>
                    {discussion.category}
                  </Text>

                  <View style={styles.tagsContainer}>
                    {discussion.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: dynamicStyles.secondaryColor }]}>
                        <Text style={[styles.tagText, { color: dynamicStyles.mutedText }]}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUpvote(discussion.id)}
                    >
                      <Icon name="thumbs-up" size={16} color={dynamicStyles.primaryColor} />
                      <Text style={styles.voteCount}>{discussion.upvotes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDownvote(discussion.id)}
                    >
                      <Icon name="thumbs-down" size={16} color="#ff4d4f" />
                      <Text style={[styles.voteCount, { color: '#ff4d4f' }]}>{discussion.downvotes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => navigation.navigate('Reply', { topicTitle: discussion.title })}
                    >
                      <Icon name="message-circle" size={16} color={dynamicStyles.primaryColor} />
                      <Text style={styles.actionButtonText}>{discussion.replies} replies</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {discussion.isNew && <View style={styles.badge}><Text style={styles.badgeText}>New</Text></View>}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* New Topic Modal */}
      <Modal
        visible={showNewTopicModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewTopicModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: dynamicStyles.backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>Create New Topic</Text>
              <TouchableOpacity onPress={() => setShowNewTopicModal(false)}>
                <Icon name="x" size={24} color={dynamicStyles.textColor} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.modalInput, { 
                color: dynamicStyles.textColor, 
                borderColor: dynamicStyles.borderColor,
                backgroundColor: dynamicStyles.cardBackground
              }]}
              placeholder="Topic Title"
              placeholderTextColor={dynamicStyles.mutedText}
              value={newTopicTitle}
              onChangeText={setNewTopicTitle}
              maxLength={100}
            />

            <TextInput
              style={[styles.modalTextArea, { 
                color: dynamicStyles.textColor, 
                borderColor: dynamicStyles.borderColor,
                backgroundColor: dynamicStyles.cardBackground
              }]}
              placeholder="Topic Content"
              placeholderTextColor={dynamicStyles.mutedText}
              value={newTopicContent}
              onChangeText={setNewTopicContent}
              multiline
              numberOfLines={6}
              maxLength={500}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: dynamicStyles.borderColor }]}
                onPress={() => setShowNewTopicModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: dynamicStyles.textColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: dynamicStyles.primaryColor }]}
                onPress={handleCreateTopic}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Create Topic</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
          <Icon name="bell" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Education</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
          <Icon name="users" size={24} color={dynamicStyles.primaryColor} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.primaryColor }]}>Forum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: '#111418',
    paddingRight: 10,
    paddingTop: 20,
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 10,
  },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#111418' },
  scrollView: { flex: 1 },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#111418',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f4',
  },
  topicIconContainer: {
    backgroundColor: '#f0f2f4',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicTextContainer: { flex: 1, flexDirection: 'column' },
  topicTitle: { fontWeight: '500', fontSize: 16, color: '#111418' },
  topicContent: {
    fontSize: 14,
    color: '#637588',
    marginTop: 4,
  },
  topicPosts: {
    fontWeight: '400',
    fontSize: 14,
    color: '#637588',
    marginTop: 4,
  },
  topicCategory: {
    fontWeight: '600',
    fontSize: 12,
    color: '#197ce5',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#637588',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#197ce5',
    fontWeight: '500',
  },
  voteCount: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#197ce5',
  },
  badge: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
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
    alignItems: 'center',
    flex: 1,  
  },
  footerButtonText: {
    color: '#677583',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonTextActive: {
    color: '#111418',
    fontWeight: '700',
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
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoriesContent: {
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f2f4',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  categoryCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalTextArea: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});
