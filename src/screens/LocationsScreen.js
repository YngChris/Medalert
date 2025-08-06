import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export const LocationsScreen = () => {
  const navigation = useNavigation();
  const [mainSearchText, setMainSearchText] = useState('');
  const [mapSearchText, setMapSearchText] = useState('');

  // Mock current tab (in a real app, use state or navigation context)
  const currentTab = 'Locations';

  const handleAddLocation = () => {
    Alert.alert('Add Location', 'This will open the add location flow.');
  };

  const handleRemoveLocation = () => {
    Alert.alert('Remove Location', 'This will allow you to remove flagged locations.');
  };

  const handleNavigate = () => {
    Alert.alert('Navigate', 'This will trigger map navigation.');
  };

  const handleFooterPress = (tabName) => {
    Alert.alert(`${tabName}`, `Navigating to ${tabName} screen...`);
    // navigation.navigate(tabName); // Uncomment if using actual screens
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flagged Locations</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={24} color="#637588" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for locations"
            placeholderTextColor="#637588"
            value={mainSearchText}
            onChangeText={setMainSearchText}
          />
        </View>
      </View>

      {/* Large Background Section */}
      <ImageBackground
        source={{
          uri:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCBGj1UBoQthAkbzaa9eH1src5EeGL2qdFGtRXVOzwaNOcbMxiSwgz1g3-YtchohahFZmFfzNQuOHfgeP4yz6o3_lH_pHQN7RB4DjvSj7jR5csfSuUKUncqC6NobQmsfBvuvsg5QUVvXjP9GMs_XyCmuFZY00U6ZN1kxxnA25Fd7U76TqDWU53n8Ujp3-ToVu6l3446cBxJIizBQNVSZkhlyx7wnOTiSXjVxgaxsC1V67WcXA35euUQVvHHTUf4ILqlHpXYOUtI-tM',
        }}
        style={styles.backgroundSection}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.backgroundSearchContainer}>
          <View style={styles.backgroundSearchInputWrapper}>
            <Icon name="search" size={24} color="#637588" style={styles.searchIcon} />
            <TextInput
              style={styles.backgroundSearchInput}
              placeholder="Search for locations"
              placeholderTextColor="#637588"
              value={mapSearchText}
              onChangeText={setMapSearchText}
            />
          </View>
          <View style={styles.backgroundButtons}>
            <TouchableOpacity style={styles.backgroundButton} onPress={handleAddLocation}>
              <Icon name="plus" size={24} color="#111418" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backgroundButton} onPress={handleRemoveLocation}>
              <Icon name="minus" size={24} color="#111418" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backgroundButton} onPress={handleNavigate}>
              <Icon
                name="navigation"
                size={24}
                color="#111418"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Footer Navigation */}
      <View style={styles.footer}>
       <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Report')}>
        <Icon name="file-plus" size={24} color="#637588" />
        <Text style={styles.footerButtonText}>Reports</Text>
       </TouchableOpacity>
       
       <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]} onPress={() => navigation.navigate('Locations')}>
        <Icon name="map-pin" size={24} color="#111418" />
        <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>Locations</Text>
       </TouchableOpacity>
       
       <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Alerts')}>
        <Icon name="bell" size={24} color="#637588" />
        <Text style={styles.footerButtonText}>Alerts</Text>
       </TouchableOpacity>
       
       <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
        <Icon name="book-open" size={24} color="#637588" />
        <Text style={styles.footerButtonText}>Education</Text>
       </TouchableOpacity>
       
       <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
        <Icon name="users" size={24} color="#111418" />
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
    paddingTop:22,
    paddingRight:10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: '#111418',
    paddingTop:20,
    paddingRight: 10,

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
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111418',
  },
  backgroundSection: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    borderRadius: 16,
  },
  backgroundSearchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
  },
  backgroundSearchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  backgroundSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111418',
  },
  backgroundButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  backgroundButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
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
  footerButtonText: {
    color: '#637588',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonTextActive: {
    color: '#111418',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
