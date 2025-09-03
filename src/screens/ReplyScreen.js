import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';

const ReplyScreen = () => {
  const [reply, setReply] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { topicTitle } = route.params;

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e0e0e0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
    headerBorderColor: theme === 'dark' ? '#404040' : '#f0f0f0',
  };

  const handleSendReply = () => {
    if (!reply.trim()) {
      Alert.alert("Reply Required", "Please type your reply before sending.");
      return;
    }

    Alert.alert(
      "Reply Sent",
      `Your reply to "${topicTitle}" has been submitted.`
    );
    navigation.goBack(); // or navigate to a "Replies" screen if needed
  };

  return (
    <View style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={[styles.header, { 
        backgroundColor: dynamicStyles.backgroundColor,
        borderBottomColor: dynamicStyles.headerBorderColor 
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Reply to Topic</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.topicText, { color: dynamicStyles.primaryColor }]}>Topic: {topicTitle}</Text>

        <TextInput
          style={[styles.input, { 
            backgroundColor: dynamicStyles.inputBackground,
            color: dynamicStyles.textColor,
            borderColor: dynamicStyles.borderColor
          }]}
          multiline
          numberOfLines={6}
          placeholder="Type your reply here..."
          placeholderTextColor={dynamicStyles.mutedText}
          value={reply}
          onChangeText={setReply}
        />

        <TouchableOpacity style={[styles.sendButton, { backgroundColor: dynamicStyles.primaryColor }]} onPress={handleSendReply}>
          <Text style={styles.sendButtonText}>Send Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReplyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    padding: 16,
  },
  topicText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  sendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
