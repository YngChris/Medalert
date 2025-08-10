<<<<<<<< HEAD:screens/ReplyScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
========
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
>>>>>>>> 907b8b32424538cf3783879dfe3835e04dc19984:src/screens/ReplyScreen.js

const ReplyScreen = () => {
  const [reply, setReply] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { topicTitle } = route.params;

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reply to Topic</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.topicText}>Topic: {topicTitle}</Text>

        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="Type your reply here..."
          value={reply}
          onChangeText={setReply}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendReply}>
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
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111418",
  },
  content: {
    padding: 16,
  },
  topicText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#197ce5",
    marginBottom: 12,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
  },
  sendButton: {
    marginTop: 16,
    backgroundColor: "#197ce5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
