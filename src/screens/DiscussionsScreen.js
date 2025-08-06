import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const DiscussionScreen = ({ route }) => {
  const { topic, content } = route.params || {};
  const [replies, setReplies] = useState([]);
  const [input, setInput] = useState('');
  const [votes, setVotes] = useState({ up: 0, down: 0 });

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
    <View style={styles.container}>
      <Text style={styles.topicTitle}>{topic}</Text>
      <Text style={styles.contentText}>{content}</Text>

      <View style={styles.voteRow}>
        <TouchableOpacity onPress={() => handleVote('up')} style={styles.voteButton}>
          <Icon name="thumbs-up" size={20} color="#2e7d32" />
          <Text style={styles.voteText}>{votes.up}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleVote('down')} style={styles.voteButton}>
          <Icon name="thumbs-down" size={20} color="#c62828" />
          <Text style={styles.voteText}>{votes.down}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Replies</Text>
      <ScrollView style={styles.replyList}>
        {replies.map((reply, index) => (
          <View key={index} style={styles.replyCard}>
            <Text style={styles.replyText}>{reply.text}</Text>
            <Text style={styles.replyTime}>{reply.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a reply..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleReply} style={styles.sendButton}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DiscussionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  voteRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  voteText: {
    marginLeft: 6,
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  replyList: {
    flex: 1,
    marginBottom: 70,
  },
  replyCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
  },
  replyTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  inputRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 30,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
