import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  TextInput,
  RefreshControl,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const contentSections = [
  {
    id: 1,
    type: 'Article',
    title: 'Understanding Expiration Dates',
    description: 'Learn how to interpret expiration dates on medication labels and what to do with expired medicines.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-m-JT0D1D6PsceDFPUOkjEQ6l4oed9tQMaBSnPqtSnTOVJVIRnZcPi2BHMtmCwymJLhdrAEHMk4N73Ism5dYkaIwnFEqv1mb5319s6W9_-am4TOUeWQX-mIeM0x0UpSs89vcEKnF2YOnZMe-WrIjoValyJg1r67VnmIvDFuXDVTR652ysMNCQJCarAIR9aMvtndrgCV5zSlY_yRuYqDQ-n-chJDDba7DDXJVf5SGRG9fxA2TjvO4ISCSPsodL1wFi9H56L1omAK4',
    category: 'Medication Safety',
    difficulty: 'Beginner',
    duration: '5 min read',
    tags: ['expiration', 'safety', 'labels'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 2,
    type: 'Infographic',
    title: 'Reading Medication Labels',
    description: 'A visual guide to understanding all the information on a medication label, including dosage, storage, and expiration.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUiZPsFG115xWNkAqcWji9q9vPp_36chNCso6xfOn2TYuVwsG3A6N4GPAdTii9gYqPkEkeYzWoJSmaPCzEWkgN4CIIYnW9_UD_AORrBmDXwBny4GbuIWUrXTywzXq05YUY5r5ag7MnCgPEvuZmbnMddVkNw926H-BPMQSqd9-ae9JEySBs7KYmQ3VumnZ4X7jDDFPEEnNbwigLfs73wJ7l-Atn45xsj9RqwPeGNUKEEwuD4joKCIGgqKWiyrAzJuiNMojmzWlubaY',
    category: 'Medication Safety',
    difficulty: 'Beginner',
    duration: '3 min read',
    tags: ['labels', 'dosage', 'storage'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 3,
    type: 'Video',
    title: 'Safe Medication Disposal',
    description: 'Watch a video tutorial on how to safely dispose of expired or unused medications to prevent harm.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBhrmwV2dZKvWBYvTh1Q3b53cCc0M-xr0NHX4DU2Wzeuak0KHdDqHaP7hi1TmjEEWs3JjxifUN4ZV01jY8FQr-8JQkp6LOGeUMLa4Ya6mLToI5dfs9jkZMIm9a6Hi77wGU0br3lSrHHYt90BQ_1ECLPupv-lzqUHQPiTEIDo7yY8gSHOaA3HWKZK67dhGdgtRBmDFi1Nvj6KGjo-ZRkOTe5GYkP33mpz4jD5dY6m7RDlaf4I9B-rzg1x2fVNa-u259S-4fTADvCws',
    category: 'Environmental Safety',
    difficulty: 'Intermediate',
    duration: '8 min video',
    tags: ['disposal', 'environment', 'safety'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 4,
    type: 'Article',
    title: 'Drug Verification System',
    description: 'Learn about the Drug Verification System and how it helps ensure the authenticity of your medications.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB81UoZt9wnhWScrvfvaGN6Qly2XtU3xM7Bx_m4NluNX-2p15g4Q8ZBR3YL_-Fqoznho9GIKF9mPq8M8GRgSxSm1Zr8bA8cUjpIckEAK4D8LCFNeBJufOmgEJpiUuKE_nAVrW6618VgV5d5_CWHxwTa5euC5CYF7Hv2ETrnrBth8Tv1Q-eukzCgIdYoA1_netwGgbyfO32AfAa4iQQH7efoyyFnxNJJs5YXRx_JS2HrbRbewvCOFXc8K6MnG5TD-1Ql-j0Tdoi422A',
    category: 'Drug Safety',
    difficulty: 'Advanced',
    duration: '7 min read',
    tags: ['verification', 'authenticity', 'system'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 5,
    type: 'Article',
    title: 'Spotting Counterfeit Drugs',
    description: 'Learn about the common signs of counterfeit medications and how to avoid them.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-XKGUu2zp-54xxHnfuaadsjKotnGEpqHp631UQ8DZUz5_akEJqgTnPLopPhMhlbfHnhxpfmBZ_JFmI_MSViQK7AqD6RaeVJrEZqHBGOwKps-1YvzzrD9wsjyDTXYxmLR1fMkyy4RDN_nnu5c5liL_kSwFxDjebdpKOt2yRiUOHIP2yJxBy9osJEoH5sqh_gO0Dlw_2e3IzJUlmSVDTjmFhfOSJJ902FHYjCs6TLG3FqOp4VrStnyM4YD6t49rlbQwJ9a2smz4XqY',
    category: 'Drug Safety',
    difficulty: 'Intermediate',
    duration: '6 min read',
    tags: ['counterfeit', 'detection', 'safety'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 6,
    type: 'Interactive Guide',
    title: 'Authenticity Checklist',
    description: 'Use our interactive checklist to verify the authenticity of your medications before use.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOuBErNL4P93gDXTZ5cfkFcRVf8-npe1zCC3utjmyBK6GrdnsuDAWxagwd2QTxpHT-rYPiXGdHtZNQBPHeYXdEGBmIMCZja0HV0qzzSB6WyxMXWk4tulDm7tL5gd8Os35R1j9GMmlMtUkn4RoO6BgAizXVzLAzzz-yBZG8CXAzECC0shf876Bj6h14gbOqvIesc3es2EGJSc-1Im0xr_AwRtrlteuow3EZ73ZGqlQhISaTzm1F5vY90fOEohWpBmEOFBnxM3mzllc',
    category: 'Drug Safety',
    difficulty: 'Beginner',
    duration: '4 min interactive',
    tags: ['checklist', 'verification', 'interactive'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 7,
    type: 'Article',
    title: 'Medication Storage Best Practices',
    description: 'Essential guidelines for storing medications properly to maintain their effectiveness and safety.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOuBErNL4P93gDXTZ5cfkFcRVf8-npe1zCC3utjmyBK6GrdnsuDAWxagwd2QTxpHT-rYPiXGdHtZNQBPHeYXdEGBmIMCZja0HV0qzzSB6WyxMXWk4tulDm7tL5gd8Os35R1j9GMmlMtUkn4RoO6BgAizXVzLAzzz-yBZG8CXAzECC0shf876Bj6h14gbOqvIesc3es2EGJSc-1Im0xr_AwRtrlteuow3EZ73ZGqlQhISaTzm1F5vY90fOEohWpBmEOFBnxM3mzllc',
    category: 'Medication Safety',
    difficulty: 'Beginner',
    duration: '5 min read',
    tags: ['storage', 'best practices', 'safety'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 8,
    type: 'Video',
    title: 'Understanding Drug Interactions',
    description: 'Learn about common drug interactions and how to prevent potentially dangerous combinations.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOuBErNL4P93gDXTZ5cfkFcRVf8-npe1zCC3utjmyBK6GrdnsuDAWxagwd2QTxpHT-rYPiXGdHtZNQBPHeYXdEGBmIMCZja0HV0qzzSB6WyxMXWk4tulDm7tL5gd8Os35R1j9GMmlMtUkn4RoO6BgAizXVzLAzzz-yBZG8CXAzECC0shf876Bj6h14gbOqvIesc3es2EGJSc-1Im0xr_AwRtrlteuow3EZ73ZGqlQhISaTzm1F5vY90fOEohWpBmEOFBnxM3mzllc',
    category: 'Drug Safety',
    difficulty: 'Advanced',
    duration: '12 min video',
    tags: ['interactions', 'combinations', 'safety'],
    isBookmarked: false,
    progress: 0,
    lastAccessed: null
  }
];

const categories = [
  { name: 'All', icon: 'grid', count: 0, color: '#197ce5' },
  { name: 'Medication Safety', icon: 'shield', count: 3, color: '#10b981' },
  { name: 'Drug Safety', icon: 'alert-triangle', count: 3, color: '#f59e0b' },
  { name: 'Environmental Safety', icon: 'leaf', count: 1, color: '#06b6d4' },
  { name: 'Best Practices', icon: 'check-circle', count: 1, color: '#8b5cf6' }
];

const difficultyLevels = [
  { name: 'All', color: '#197ce5' },
  { name: 'Beginner', color: '#10b981' },
  { name: 'Intermediate', color: '#f59e0b' },
  { name: 'Advanced', color: '#ef4444' }
];

export const EducationScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [content, setContent] = useState(contentSections);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'difficulty', 'duration'
  const [showBookmarks, setShowBookmarks] = useState(false);
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

  // Filter content by category, difficulty, and search
  const filteredContent = content.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesBookmarks = !showBookmarks || item.isBookmarked;
    
    return matchesCategory && matchesDifficulty && matchesSearch && matchesBookmarks;
  });

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.progress || 0) - (a.progress || 0);
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'recent':
      default:
        return (b.lastAccessed || 0) - (a.lastAccessed || 0);
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleBookmark = (id) => {
    setContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleContentPress = (item) => {
    // Update last accessed time
    setContent(prev => 
      prev.map(contentItem => 
        contentItem.id === item.id 
          ? { ...contentItem, lastAccessed: Date.now() }
          : contentItem
      )
    );
    navigation.navigate('ContentDetail', { section: item });
  };

  const handleProgressUpdate = (id, progress) => {
    setContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, progress } : item
      )
    );
  };

  const getProgressColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#197ce5';
    }
  };

  const renderCategories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === category.name && { backgroundColor: category.color }
          ]}
          onPress={() => handleCategorySelect(category.name)}
        >
          <Icon 
            name={category.icon} 
            size={16} 
            color={selectedCategory === category.name ? '#fff' : category.color} 
          />
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category.name && { color: '#fff' }
          ]}>
            {category.name}
          </Text>
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
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDifficultyFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.difficultyContainer}
      contentContainerStyle={styles.difficultyContent}
    >
      {difficultyLevels.map((difficulty, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.difficultyButton,
            selectedDifficulty === difficulty.name && { backgroundColor: difficulty.color }
          ]}
          onPress={() => handleDifficultySelect(difficulty.name)}
        >
          <Text style={[
            styles.difficultyButtonText,
            selectedDifficulty === difficulty.name && { color: '#fff' }
          ]}>
            {difficulty.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSortButtons = () => (
    <View style={styles.sortContainer}>
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
        style={[styles.sortButton, sortBy === 'difficulty' && { backgroundColor: dynamicStyles.primaryColor }]}
        onPress={() => handleSortChange('difficulty')}
      >
        <Text style={[styles.sortButtonText, sortBy === 'difficulty' && { color: '#fff' }]}>Difficulty</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContentCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.contentSection, { backgroundColor: dynamicStyles.cardBackground }]}
      onPress={() => handleContentPress(item)}
    >
      <View style={styles.textContainer}>
        <View style={styles.contentHeader}>
          <Text style={[styles.contentType, { color: dynamicStyles.mutedText }]}>{item.type}</Text>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => handleBookmark(item.id)}
          >
            <Icon 
              name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={item.isBookmarked ? dynamicStyles.primaryColor : dynamicStyles.mutedText} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.contentTitle, { color: dynamicStyles.textColor }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.contentDescription, { color: dynamicStyles.mutedText }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.contentMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getProgressColor(item.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getProgressColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>
          <Text style={[styles.durationText, { color: dynamicStyles.mutedText }]}>
            {item.duration}
          </Text>
        </View>

        {item.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: getProgressColor(item.difficulty)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: dynamicStyles.mutedText }]}>
              {item.progress}% complete
            </Text>
          </View>
        )}

        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: dynamicStyles.secondaryColor }]}>
              <Text style={[styles.tagText, { color: dynamicStyles.mutedText }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.imageOverlay}>
          <Icon name="play" size={24} color="#fff" style={styles.playIcon} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Education</Text>
        <TouchableOpacity 
          style={styles.bookmarkToggle}
          onPress={() => setShowBookmarks(!showBookmarks)}
        >
          <Icon 
            name={showBookmarks ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={showBookmarks ? dynamicStyles.primaryColor : dynamicStyles.textColor} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: dynamicStyles.secondaryColor }]}>
          <Icon name="search" size={20} color={dynamicStyles.mutedText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.textColor }]}
            placeholder="Search educational content..."
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

      {/* Categories */}
      {renderCategories()}

      {/* Difficulty Filters */}
      {renderDifficultyFilters()}

      {/* Sort Options */}
      {renderSortButtons()}

      {/* Content */}
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
        {sortedContent.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: dynamicStyles.secondaryColor }]}>
            <Icon name="book-open" size={48} color={dynamicStyles.mutedText} />
            <Text style={[styles.emptyStateText, { color: dynamicStyles.textColor }]}>
              No content found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: dynamicStyles.mutedText }]}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        ) : (
          sortedContent.map(renderContentCard)
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: dynamicStyles.backgroundColor, borderTopColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Report')}>
          <Icon name="file-plus" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color={dynamicStyles.primaryColor} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.primaryColor }]}>
            Education
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Forum')}>
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
    paddingTop: 40,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingRight: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: '#111418',
    paddingTop: 20,
  },
  bookmarkToggle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 20,
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
  contentSection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  contentType: {
    color: '#637588',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  contentTitle: {
    color: '#111418',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  contentDescription: {
    color: '#637588',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
    lineHeight: 20,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 12,
    color: '#637588',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
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
  imageBackground: {
    flex: 1,
    aspectRatio: 16 / 9,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    opacity: 0.9,
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#637588',
  },
  difficultyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  difficultyContent: {
    alignItems: 'center',
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f2f4',
  },
  difficultyButtonText: {
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
    borderTopColor: '#f0f2f4',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#637588',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonTextActive: {
    color: '#111418',
    fontWeight: '700',
  },
});
