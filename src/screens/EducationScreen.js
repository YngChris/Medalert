import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const contentSections = [
  {
    type: 'Article',
    title: 'Understanding Expiration Dates',
    description:
      'Learn how to interpret expiration dates on medication labels and what to do with expired medicines.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-m-JT0D1D6PsceDFPUOkjEQ6l4oed9tQMaBSnPqtSnTOVJVIRnZcPi2BHMtmCwymJLhdrAEHMk4N73Ism5dYkaIwnFEqv1mb5319s6W9_-am4TOUeWQX-mIeM0x0UpSs89vcEKnF2YOnZMe-WrIjoValyJg1r67VnmIvDFuXDVTR652ysMNCQJCarAIR9aMvtndrgCV5zSlY_yRuYqDQ-n-chJDDba7DDXJVf5SGRG9fxA2TjvO4ISCSPsodL1wFi9H56L1omAK4',
  },
  {
    type: 'Infographic',
    title: 'Reading Medication Labels',
    description:
      'A visual guide to understanding all the information on a medication label, including dosage, storage, and expiration.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUiZPsFG115xWNkAqcWji9q9vPp_36chNCso6xfOn2TYuVwsG3A6N4GPAdTii9gYqPkEkeYzWoJSmaPCzEWkgN4CIIYnW9_UD_AORrBmDXwBny4GbuIWUrXTywzXq05YUY5r5ag7MnCgPEvuZmbnMddVkNw926H-BPMQSqd9-ae9JEySBs7KYmQ3VumnZ4X7jDDFPEEnNbwigLfs73wJ7l-Atn45xsj9RqwPeGNUKEEwuD4joKCIGgqKWiyrAzJuiNMojmzWlubaY',
  },
  {
    type: 'Video',
    title: 'Safe Medication Disposal',
    description:
      'Watch a video tutorial on how to safely dispose of expired or unused medications to prevent harm.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBhrmwV2dZKvWBYvTh1Q3b53cCc0M-xr0NHX4DU2Wzeuak0KHdDqHaP7hi1TmjEEWs3JjxifUN4ZV01jY8FQr-8JQkp6LOGeUMLa4Ya6mLToI5dfs9jkZMIm9a6Hi77wGU0br3lSrHHYt90BQ_1ECLPupv-lzqUHQPiTEIDo7yY8gSHOaA3HWKZK67dhGdgtRBmDFi1Nvj6KGjo-ZRkOTe5GYkP33mpz4jD5dY6m7RDlaf4I9B-rzg1x2fVNa-u259S-4fTADvCws',
  },
  {
    type: 'Article',
    title: 'Drug Verification System',
    description:
      'Learn about the Drug Verification System and how it helps ensure the authenticity of your medications.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB81UoZt9wnhWScrvfvaGN6Qly2XtU3xM7Bx_m4NluNX-2p15g4Q8ZBR3YL_-Fqoznho9GIKF9mPq8M8GRgSxSm1Zr8bA8cUjpIckEAK4D8LCFNeBJufOmgEJpiUuKE_nAVrW6618VgV5d5_CWHxwTa5euC5CYF7Hv2ETrnrBth8Tv1Q-eukzCgIdYoA1_netwGgbyfO32AfAa4iQQH7efoyyFnxNJJs5YXRx_JS2HrbRbewvCOFXc8K6MnG5TD-1Ql-j0Tdoi422A',
  },
  {
    type: 'Article',
    title: 'Spotting Counterfeit Drugs',
    description:
      'Learn about the common signs of counterfeit medications and how to avoid them.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-XKGUu2zp-54xxHnfuaadsjKotnGEpqHp631UQ8DZUz5_akEJqgTnPLopPhMhlbfHnhxpfmBZ_JFmI_MSViQK7AqD6RaeVJrEZqHBGOwKps-1YvzzrD9wsjyDTXYxmLR1fMkyy4RDN_nnu5c5liL_kSwFxDjebdpKOt2yRiUOHIP2yJxBy9osJEoH5sqh_gO0Dlw_2e3IzJUlmSVDTjmFhfOSJJ902FHYjCs6TLG3FqOp4VrStnyM4YD6t49rlbQwJ9a2smz4XqY',
  },
  {
    type: 'Interactive Guide',
    title: 'Authenticity Checklist',
    description:
      'Use our interactive checklist to verify the authenticity of your medications before use.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOuBErNL4P93gDXTZ5cfkFcRVf8-npe1zCC3utjmyBK6GrdnsuDAWxagwd2QTxpHT-rYPiXGdHtZNQBPHeYXdEGBmIMCZja0HV0qzzSB6WyxMXWk4tulDm7tL5gd8Os35R1j9GMmlMtUkn4RoO6BgAizXVzLAzzz-yBZG8CXAzECC0shf876Bj6h14gbOqvIesc3es2EGJSc-1Im0xr_AwRtrlteuow3EZ73ZGqlQhISaTzm1F5vY90fOEohWpBmEOFBnxM3mzllc',
  },
];

export const EducationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Education</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Scrollable Educational Sections */}
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        {contentSections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contentSection}
            onPress={() => navigation.navigate('ContentDetail', { section })}>
            <View style={styles.textContainer}>
              <Text style={styles.contentType}>{section.type}</Text>
              <Text style={styles.contentTitle}>{section.title}</Text>
              <Text style={styles.contentDescription}>{section.description}</Text>
            </View>
            <ImageBackground
              source={{ uri: section.imageUrl }}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Report')}>
          <Icon name="file-plus" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Locations')}>
          <Icon name="map-pin" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
          onPress={() => navigation.navigate('Education')}>
          <Icon name="book-open" size={24} color="#111418" />
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>
            Education
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Forum')}>
          <Icon name="users" size={24} color="#637588" />
          <Text style={styles.footerButtonText}>Forum</Text>
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
  scrollView: {
    flex: 1,
  },
  contentSection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  textContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
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
  },
  contentDescription: {
    color: '#637588',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  imageBackground: {
    flex: 1,
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  imageStyle: {
    borderRadius: 12,
    resizeMode: 'cover',
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
  footerButtonActive: {
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    paddingVertical: 6,
  },
  footerButtonText: {
    color: '#637588',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonTextActive: {
    color: '#111418',
  },
});
