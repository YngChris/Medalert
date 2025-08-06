import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const trendingTopics = [
  { title: 'Safe Disposal of Medications', posts: 120 },
  { title: 'Understanding Drug Interactions', posts: 85 },
  { title: 'Finding Affordable Alternatives', posts: 60 },
];

const recentDiscussions = [
  { title: 'New Guidelines on Antibiotic Use', author: 'Dr. Amelia Harper', time: '2 days ago' },
  { title: 'Experiences with Generic Medications', author: 'Ethan Bennett', time: '4 days ago' },
  { title: 'Managing Side Effects of Common Drugs', author: 'Sophia Carter', time: '1 week ago' },
];

export const ForumScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const handleTopicPress = (title) => {
    Alert.alert('Topic Selected', `You tapped on: ${title}`);
  };

  const handleAddTopic = () => {
    Alert.alert('Add New Topic', 'This will open the add-topic screen.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Forum</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={24} color="#637588" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics"
            placeholderTextColor="#637588"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        {trendingTopics.map((topic, index) => (
          <TouchableOpacity key={index} onPress={() => handleTopicPress(topic.title)}>
            <View style={styles.topicItem}>
              <View style={styles.topicIconContainer}>
                <Icon name="hash" size={24} color="#111418" />
              </View>
              <View style={styles.topicTextContainer}>
                <Text style={styles.topicTitle} numberOfLines={1}>{topic.title}</Text>
                <Text style={styles.topicPosts}>{topic.posts} posts</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Discussions</Text>
        {recentDiscussions.map((discussion, index) => (
          <TouchableOpacity key={index} onPress={() => handleTopicPress(discussion.title)}>
            <View style={styles.topicItem}>
              <View style={styles.topicIconContainer}>
                <Icon name="hash" size={24} color="#111418" />
              </View>
              <View style={styles.topicTextContainer}>
                <Text style={styles.topicTitle} numberOfLines={1}>{discussion.title}</Text>
                <Text style={styles.topicPosts}>
                  By {discussion.author} · {discussion.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTopic}>
            <Icon name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Report')}>
          <Icon name="file-plus" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Education</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]} onPress={() => navigation.navigate('Forum')}>
          <Icon name="users" size={24} color="#111418" />
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>Forum</Text>
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
    paddingTop:40,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingRight:10,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111418',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#111418',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  topicTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  topicTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#111418',
  },
  topicPosts: {
    fontWeight: '400',
    fontSize: 14,
    color: '#637588',
    marginTop: 4,
  },
  addButtonContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: '#197ce5',
    borderRadius: 12,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#637588',
    marginTop: 4,
  },
  footerButtonTextActive: {
    color: '#111418',
    fontWeight: '600',
  },
});
