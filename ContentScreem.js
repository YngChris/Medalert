import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export const ContentDetailScreen = ({ route }) => {
  const { section } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.type}>{section.type}</Text>
      <Text style={styles.title}>{section.title}</Text>
      <Image source={{ uri: section.imageUrl }} style={styles.image} />

      {section.type === 'Article' && (
        <Text style={styles.content}>
          {section.title === 'Understanding Expiration Dates' &&
            `Expiration dates indicate the last day a medication is guaranteed to be effective and safe. After this date, the chemical composition might change, reducing effectiveness or causing harm. Always check dates before use and dispose of expired meds properly.`}

          {section.title === 'Drug Verification System' &&
            `The Drug Verification System helps consumers verify medication authenticity using unique barcodes or digital codes. Always scan or enter this code on official platforms before use.`}

          {section.title === 'Spotting Counterfeit Drugs' &&
            `Counterfeit drugs may have packaging differences, unusual smell, taste, or texture, or may not work as expected. Only purchase medications from trusted pharmacies.`}
        </Text>
      )}

      {section.type === 'Infographic' && (
        <Text style={styles.content}>
          This infographic simplifies how to read a medication label including dosage, strength, and storage information.
        </Text>
      )}

      {section.type === 'Video' && (
        <Text style={styles.content}>
          This is a video guide on proper medication disposal. (Embedding YouTube/MP4 player can be done here.)
        </Text>
      )}

      {section.type === 'Interactive Guide' && (
        <>
          <Text style={styles.content}>Authenticity Checklist:</Text>
          <Text style={styles.checklist}>• Check manufacturer details</Text>
          <Text style={styles.checklist}>• Look for security seals</Text>
          <Text style={styles.checklist}>• Use digital verification apps</Text>
          <Text style={styles.checklist}>• Inspect packaging and expiry</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  type: {
    fontSize: 14,
    color: '#637588',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111418',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  checklist: {
    fontSize: 16,
    color: '#444',
    paddingLeft: 8,
    marginTop: 8,
  },
});
