import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const DiscussionScreen = ({ route }) => {
  const { topic, content } = route.params || {};
  const [replies, setReplies] = useState([]);
  const [input, setInput] = useState('');
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#666666',
    borderColor: theme === 'dark' ? '#404040' : '#e0e0e0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    primaryColor: '#197ce5',
  };

  const handleReply = () => {
    if (input.trim()) {
      setReplies([{ text: input, time: new Date().toLocaleTimeString() }, ...replies]);
      setInput('');
    }
  };

  const handleVote = (type) => {
    setVotes((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Discussion</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.topicTitle, { color: dynamicStyles.textColor }]}>{topic}</Text>
        <Text style={[styles.contentText, { color: dynamicStyles.mutedText }]}>{content}</Text>

        <View style={styles.voteRow}>
          <TouchableOpacity onPress={() => handleVote('up')} style={styles.voteButton}>
            <Icon name="thumbs-up" size={20} color="#2e7d32" />
            <Text style={[styles.voteText, { color: dynamicStyles.textColor }]}>{votes.up}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVote('down')} style={styles.voteButton}>
            <Icon name="thumbs-down" size={20} color="#c62828" />
            <Text style={[styles.voteText, { color: dynamicStyles.textColor }]}>{votes.down}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionHeader, { color: dynamicStyles.textColor }]}>Replies</Text>
        <View style={styles.replyList}>
          {replies.map((reply, index) => (
            <View key={index} style={[styles.replyCard, { 
              backgroundColor: dynamicStyles.cardBackground,
              borderColor: dynamicStyles.borderColor 
            }]}>
              <Text style={[styles.replyText, { color: dynamicStyles.textColor }]}>{reply.text}</Text>
              <Text style={[styles.replyTime, { color: dynamicStyles.mutedText }]}>{reply.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: dynamicStyles.inputBackground,
            color: dynamicStyles.textColor,
            borderColor: dynamicStyles.borderColor
          }]}
          placeholder="Write a reply..."
          placeholderTextColor={dynamicStyles.mutedText}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleReply} style={[styles.sendButton, { backgroundColor: dynamicStyles.primaryColor }]}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DiscussionScreen;

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
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    marginVertical: 10,
    lineHeight: 20,
  },
  voteRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 8,
  },
  voteText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  replyList: {
    marginBottom: 20,
  },
  replyCard: {
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
  replyText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  replyTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
