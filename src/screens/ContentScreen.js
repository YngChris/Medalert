import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export const ContentDetailScreen = ({ route }) => {
  const { section } = route.params;
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637588',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    contentText: theme === 'dark' ? '#e0e0e0' : '#444444',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Content Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.type, { color: dynamicStyles.mutedText }]}>{section.type}</Text>
        <Text style={[styles.title, { color: dynamicStyles.textColor }]}>{section.title}</Text>
        <Image source={{ uri: section.imageUrl }} style={styles.image} />

        {section.type === 'Article' && (
          <Text style={[styles.content, { color: dynamicStyles.contentText }]}>
            {section.title === 'Understanding Expiration Dates' &&
              `Expiration dates indicate the last day a medication is guaranteed to be effective and safe. After this date, the chemical composition might change, reducing effectiveness or causing harm. Always check dates before use and dispose of expired meds properly.`}

            {section.title === 'Drug Verification System' &&
              `The Drug Verification System helps consumers verify medication authenticity using unique barcodes or digital codes. Always scan or enter this code on official platforms before use.`}

            {section.title === 'Spotting Counterfeit Drugs' &&
              `Counterfeit drugs may have packaging differences, unusual smell, taste, or texture, or may not work as expected. Only purchase medications from trusted pharmacies.`}
          </Text>
        )}

        {section.type === 'Infographic' && (
          <Text style={[styles.content, { color: dynamicStyles.contentText }]}>
            This infographic simplifies how to read a medication label including dosage, strength, and storage information.
          </Text>
        )}

        {section.type === 'Video' && (
          <Text style={[styles.content, { color: dynamicStyles.contentText }]}>
            This is a video guide on proper medication disposal. (Embedding YouTube/MP4 player can be done here.)
          </Text>
        )}

        {section.type === 'Interactive Guide' && (
          <>
            <Text style={[styles.content, { color: dynamicStyles.contentText }]}>Authenticity Checklist:</Text>
            <Text style={[styles.checklist, { color: dynamicStyles.contentText }]}>• Check manufacturer details</Text>
            <Text style={[styles.checklist, { color: dynamicStyles.contentText }]}>• Look for security seals</Text>
            <Text style={[styles.checklist, { color: dynamicStyles.contentText }]}>• Use digital verification apps</Text>
            <Text style={[styles.checklist, { color: dynamicStyles.contentText }]}>• Inspect packaging and expiry</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  scrollContainer: {
    padding: 16,
  },
  type: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 28,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  checklist: {
    fontSize: 16,
    paddingLeft: 8,
    marginTop: 8,
    lineHeight: 22,
  },
});
