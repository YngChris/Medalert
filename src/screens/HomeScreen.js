import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user: authUser, isAuthenticated } = useAuth();

  // Get user data from AuthContext, fallback to route params, then to default
  const user = authUser || route.params?.user || { firstName: '', lastName: '', profileImage: null };

  const navigateTo = (screen) => {
    navigation.navigate(screen, { user });
  };

  // Simple theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8fafc',
    textColor: theme === 'dark' ? '#ffffff' : '#0f172a',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#64748b',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    primaryColor: '#197ce5',
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Enhanced Header */}
      <View style={[styles.headerSection, { backgroundColor: dynamicStyles.cardBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeText}>
            <Text style={[styles.greeting, { color: dynamicStyles.mutedText }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.title, { color: dynamicStyles.textColor }]}>
              Welcome, {user.firstName} {user.lastName}!
            </Text>
            <Text style={[styles.description, { color: dynamicStyles.mutedText }]}>
              Your companion in understanding, managing, and reacting to drug alerts.
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile', { user })}
          >
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profilePlaceholder, { backgroundColor: dynamicStyles.primaryColor }]}>
                <Icon name="user" size={24} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Feature Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigateTo('Report')}
        >
          <View style={[styles.cardIcon, { backgroundColor: `${dynamicStyles.primaryColor}15` }]}>
            <Icon name="file-plus" size={28} color={dynamicStyles.primaryColor} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>
              Report Issue
            </Text>
            <Text style={[styles.cardText, { color: dynamicStyles.mutedText }]}>
              Report a drug or medication problem
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigateTo('Locations')}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#3b82f615' }]}>
            <Icon name="map-pin" size={28} color="#3b82f6" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>
              Find Centers
            </Text>
            <Text style={[styles.cardText, { color: dynamicStyles.mutedText }]}>
              Locate nearby medical facilities
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigateTo('Alerts')}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#f59e0b15' }]}>
            <Icon name="bell" size={28} color="#f59e0b" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>
              Safety Alerts
            </Text>
            <Text style={[styles.cardText, { color: dynamicStyles.mutedText }]}>
              Stay updated on drug recalls
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigateTo('Education')}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#10b98115' }]}>
            <Icon name="book-open" size={28} color="#10b981" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>
              Learn & Educate
            </Text>
            <Text style={[styles.cardText, { color: dynamicStyles.mutedText }]}>
              Access drug safety resources
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigateTo('Forum')}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#06b6d415' }]}>
            <Icon name="users" size={28} color="#06b6d4" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: dynamicStyles.textColor }]}>
              Community Forum
            </Text>
            <Text style={[styles.cardText, { color: dynamicStyles.mutedText }]}>
              Connect with other users
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={dynamicStyles.mutedText} />
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  welcomeText: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HomeScreen;
