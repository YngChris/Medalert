import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();

  // Get user data from navigation parameters
  const user = route.params?.user || { firstName: '', lastName: '' };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image
          source={{
            uri: 'https://medalertapp.netlify.app/_next/static/media/sick_kid.1858f768.png',
          }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={24} color="#111418" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>
          WELCOME {user.firstName} {user.lastName}!
        </Text>
        <Text style={styles.description}>
          Your companion in understanding, managing, and reacting to drug
          alerts.
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('Report')}>
          <View style={styles.cardContent}>
            <Icon name="file-plus" size={32} color="#0a2540" />
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardText}>Report a drug or medication</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateTo('Locations')}>
          <View style={styles.iconWrapper}>
            <Icon name="map-pin" size={32} color="#0a2540" />
            <Text style={styles.cardTitle}>Locations</Text>
            <Text style={styles.cardText}>Nearby medical centers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateTo('Alerts')}>
          <View style={styles.iconWrapper}>
            <Icon name="bell" size={32} color="#0a2540" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Alerts</Text>
            <Text style={styles.cardText}>Active drug alerts & recalls</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateTo('Education')}>
          <View style={styles.iconWrapper}>
            <Icon name="book-open" size={32} color="#0a2540" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Education</Text>
            <Text style={styles.cardText}>Learn about drug safety</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateTo('Forum')}>
          <View style={styles.iconWrapper}>
            <Icon name="users" size={32} color="#0a2540" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Forum</Text>
            <Text style={styles.cardText}>Talk to other users</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f8',
    flex: 1,
  },
  headerImageContainer: {
    height: 180,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 150,
    width: 250,
  },
  settingsIcon: {
    position: 'absolute',
    top: 30,
    right: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0a2540',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#475569',
  },
  cardContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  iconWrapper: {
    alignItems: 'left',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#0a2540',
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
});

export default HomeScreen;
