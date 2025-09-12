import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';
import MapView, { Marker, Callout } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { locationsStorage } from '../utils/locationsStorage';
import Toast from 'react-native-toast-message';
import { EXPO_PUBLIC_GOOGLE_PLACES_API_KEY } from "@env";

const LocationsScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showPlacesSearch, setShowPlacesSearch] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 5.6037,
    longitude: -0.187,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637588',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f2f4f7',
    primaryColor: '#197ce5',
  };

  // Load locations from storage
  const loadLocations = async () => {
    try {
      setLoading(true);
      const storedLocations = await locationsStorage.getAllLocations();
      setLocations(storedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load locations. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load locations when screen mounts and when it comes into focus
  useEffect(() => {
    loadLocations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadLocations();
    }, [])
  );

  // Filter locations based on search (with null check)
  const filteredLocations = (locations || []).filter((location) =>
    location.name.toLowerCase().includes(searchText.toLowerCase()) ||
    location.address.toLowerCase().includes(searchText.toLowerCase())
  );

  // Combine filtered locations with search results
  const allDisplayLocations = [...filteredLocations, ...(searchResults || [])];

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setMapRegion(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handlePlaceSelect = (data, details) => {
    if (details) {
      const { geometry, name, formatted_address, place_id } = details;
      const newLocation = {
        id: `search_${place_id}`,
        name: name || data.description,
        address: formatted_address || data.description,
        lat: geometry.location.lat,
        lng: geometry.location.lng,
        type: "Search Result",
        status: "Clear",
        rating: 0,
        distance: "Unknown",
        phone: "N/A",
        image: "https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=LOC",
        isUserAdded: false,
        isSearchResult: true,
      };
      
      setSearchResults([newLocation]);
      setSelectedLocation(newLocation);
      
      const newRegion = {
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      
      setShowPlacesSearch(false);
    }
  };

  const handleAddSearchResult = async (location) => {
    try {
      const locationData = {
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        type: location.type,
        phone: location.phone,
      };
      
      await locationsStorage.addLocation(locationData);
      await loadLocations();
      
      // Remove from search results
      setSearchResults([]);
      
      Toast.show({
        type: 'success',
        text1: 'Location Added',
        text2: `${location.name} has been added to your locations.`,
      });
    } catch (error) {
      console.error('Error adding search result:', error);
      Alert.alert('Error', 'Failed to add location. Please try again.');
    }
  };

  const handleCall = (phone) => {
    Alert.alert("Call", `Call ${phone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => console.log("Calling...") }
    ]);
  };

  const handleNavigate = (location) => {
    Alert.alert("Navigation", `Navigate to ${location.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Navigate", onPress: () => console.log("Navigating...") }
    ]);
  };

  const handleReportIssue = (location) => {
    navigation.navigate('Report', { 
      location: location.name,
      address: location.address 
    });
  };

  const handleDeleteLocation = (location) => {
    if (!location.isUserAdded) {
      Alert.alert('Cannot Delete', 'Default locations cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete "${location.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await locationsStorage.deleteLocation(location.id);
              await loadLocations();
              Toast.show({
                type: 'success',
                text1: 'Location Deleted',
                text2: `${location.name} has been removed.`,
              });
            } catch (error) {
              console.error('Error deleting location:', error);
              Alert.alert('Error', 'Failed to delete location. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Clear": return "#28a745";
      case "Under Review": return "#ffc107";
      case "Warning": return "#fd7e14";
      case "Flagged": return "#dc3545";
      default: return "#637588";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Clear": return "check-circle";
      case "Under Review": return "clock";
      case "Warning": return "alert-triangle";
      case "Flagged": return "x-circle";
      default: return "help-circle";
    }
  };

  const renderLocationCard = (location) => (
    <TouchableOpacity
      key={location.id}
      style={[styles.locationCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}
      onPress={() => handleLocationPress(location)}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: location.image }} style={styles.locationImage} />
        <View style={styles.cardHeaderContent}>
          <Text style={[styles.locationName, { color: dynamicStyles.textColor }]}>
            {location.name}
          </Text>
          <Text style={[styles.locationType, { color: dynamicStyles.mutedText }]}>
            {location.type}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#ffc107" />
            <Text style={[styles.rating, { color: dynamicStyles.mutedText }]}>
              {location.rating} • {location.distance}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(location.status)}15` }]}>
            <Icon name={getStatusIcon(location.status)} size={12} color={getStatusColor(location.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(location.status) }]}>
              {location.status}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.locationAddress, { color: dynamicStyles.mutedText }]}>
        {location.address}
      </Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${dynamicStyles.primaryColor}15` }]}
          onPress={() => handleCall(location.phone)}
        >
          <Icon name="phone" size={16} color={dynamicStyles.primaryColor} />
          <Text style={[styles.actionButtonText, { color: dynamicStyles.primaryColor }]}>
            Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b98115' }]}
          onPress={() => handleNavigate(location)}
        >
          <Icon name="navigation" size={16} color="#10b981" />
          <Text style={[styles.actionButtonText, { color: '#10b981' }]}>
            Navigate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f59e0b15' }]}
          onPress={() => handleReportIssue(location)}
        >
          <Icon name="alert-triangle" size={16} color="#f59e0b" />
          <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>
            Report
          </Text>
        </TouchableOpacity>

        {location.isUserAdded && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#dc354515' }]}
            onPress={() => handleDeleteLocation(location)}
          >
            <Icon name="trash-2" size={16} color="#dc3545" />
            <Text style={[styles.actionButtonText, { color: '#dc3545' }]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSearchResultCard = (location) => (
    <TouchableOpacity
      key={location.id}
      style={[styles.locationCard, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}
      onPress={() => handleLocationPress(location)}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: location.image }} style={styles.locationImage} />
        <View style={styles.cardHeaderContent}>
          <Text style={[styles.locationName, { color: dynamicStyles.textColor }]}>
            {location.name}
          </Text>
          <Text style={[styles.locationType, { color: dynamicStyles.mutedText }]}>
            {location.type}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#ffc107" />
            <Text style={[styles.rating, { color: dynamicStyles.mutedText }]}>
              {location.rating} • {location.distance}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(location.status)}15` }]}>
            <Icon name={getStatusIcon(location.status)} size={12} color={getStatusColor(location.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(location.status) }]}>
              {location.status}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.locationAddress, { color: dynamicStyles.mutedText }]}>
        {location.address}
      </Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${dynamicStyles.primaryColor}15` }]}
          onPress={() => handleCall(location.phone)}
        >
          <Icon name="phone" size={16} color={dynamicStyles.primaryColor} />
          <Text style={[styles.actionButtonText, { color: dynamicStyles.primaryColor }]}>
            Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b98115' }]}
          onPress={() => handleNavigate(location)}
        >
          <Icon name="navigation" size={16} color="#10b981" />
          <Text style={[styles.actionButtonText, { color: '#10b981' }]}>
            Navigate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f59e0b15' }]}
          onPress={() => handleReportIssue(location)}
        >
          <Icon name="alert-triangle" size={16} color="#f59e0b" />
          <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>
            Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleAddSearchResult(location)}
        >
          <Icon name="plus" size={16} color="#ffffff" />
          <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>
            Add to My Locations
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Locations</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AddLocation')}
        >
          <Icon name="plus" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        {!showPlacesSearch ? (
          <View style={styles.searchToggleContainer}>
            <View style={[styles.searchInputWrapper, { backgroundColor: dynamicStyles.inputBackground, flex: 1 }]}>
              <Icon
                name="search"
                size={20}
                color={dynamicStyles.mutedText}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: dynamicStyles.textColor }]}
                placeholder="Search saved locations..."
                placeholderTextColor={dynamicStyles.mutedText}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Icon name="x" size={20} color={dynamicStyles.mutedText} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.placesSearchButton, { backgroundColor: dynamicStyles.primaryColor }]}
              onPress={() => setShowPlacesSearch(true)}
            >
              <Icon name="map-pin" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placesSearchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search places on Google Maps..."
              onPress={handlePlaceSelect}
              query={{
                key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                language: 'en',
                components: 'country:gh', // Restrict to Ghana
              }}
              fetchDetails={true}
              styles={{
                container: {
                  flex: 1,
                },
                textInputContainer: {
                  backgroundColor: dynamicStyles.inputBackground,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  height: 48,
                },
                textInput: {
                  backgroundColor: 'transparent',
                  color: dynamicStyles.textColor,
                  fontSize: 16,
                  height: 48,
                },
                listView: {
                  backgroundColor: dynamicStyles.backgroundColor,
                  borderRadius: 12,
                  marginTop: 8,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                },
                row: {
                  backgroundColor: dynamicStyles.cardBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                },
                description: {
                  color: dynamicStyles.textColor,
                  fontSize: 14,
                },
                predefinedPlacesDescription: {
                  color: dynamicStyles.mutedText,
                },
              }}
              renderLeftButton={() => (
                <View style={styles.placesSearchIcon}>
                  <Icon name="search" size={20} color={dynamicStyles.mutedText} />
                </View>
              )}
              renderRightButton={() => (
                <TouchableOpacity
                  style={styles.closePlacesSearch}
                  onPress={() => {
                    setShowPlacesSearch(false);
                    setSearchResults([]);
                  }}
                >
                  <Icon name="x" size={20} color={dynamicStyles.mutedText} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={[styles.resultsText, { color: dynamicStyles.mutedText }]}>
          {allDisplayLocations.length} location{allDisplayLocations.length !== 1 ? 's' : ''} found
          {searchResults.length > 0 && (
            <Text style={{ color: dynamicStyles.primaryColor }}>
              {' '}({searchResults.length} from search)
            </Text>
          )}
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          onLongPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            Alert.alert(
              'Add New Location',
              `Do you want to add a location at this point?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Add Location',
                  onPress: () => {
                    const newLocation = {
                      id: Date.now().toString(),
                      name: 'New Location',
                      address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                      lat: latitude,
                      lng: longitude,
                      type: 'Pharmacy',
                      status: 'Available',
                      rating: 0,
                      distance: '0 km',
                      phone: '',
                      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=100',
                      isUserAdded: true
                    };
                    handleAddLocation(newLocation);
                  }
                }
              ]
            );
          }}
          onPress={(e) => {
            // Deselect location when tapping on empty map space
            if (e.nativeEvent.action !== 'marker-press') {
              setSelectedLocation(null);
            }
          }}
        >
          {allDisplayLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.lat, longitude: location.lng }}
              title={location.name}
              description={location.status}
              onPress={() => setSelectedLocation(location)}
              pinColor={location.isSearchResult ? '#ff6b6b' : '#197ce5'}
            >
              <Callout onPress={() => {
                if (location.isSearchResult) {
                  handleAddSearchResult(location);
                } else {
                  handleLocationPress(location);
                }
              }}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{location.name}</Text>
                  <Text style={styles.calloutStatus}>{location.status}</Text>
                  <Text style={styles.calloutAddress}>{location.address}</Text>
                  <View style={styles.calloutActions}>
                    <TouchableOpacity
                      style={[styles.calloutButton, { backgroundColor: '#10b98115' }]}
                      onPress={() => handleNavigate(location)}
                    >
                      <Icon name="navigation" size={14} color="#10b981" />
                      <Text style={[styles.calloutButtonText, { color: '#10b981' }]}>Navigate</Text>
                    </TouchableOpacity>
                    {location.isSearchResult && (
                      <TouchableOpacity
                        style={[styles.calloutButton, { backgroundColor: '#4CAF5015' }]}
                        onPress={() => handleAddSearchResult(location)}
                      >
                        <Icon name="plus" size={14} color="#4CAF50" />
                        <Text style={[styles.calloutButtonText, { color: '#4CAF50' }]}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={[styles.mapControlButton, { backgroundColor: dynamicStyles.backgroundColor }]}
            onPress={() => {
              const newRegion = {
                ...mapRegion,
                latitudeDelta: mapRegion.latitudeDelta * 0.5,
                longitudeDelta: mapRegion.longitudeDelta * 0.5,
              };
              mapRef.current?.animateToRegion(newRegion, 500);
            }}
          >
            <Icon name="plus" size={20} color={dynamicStyles.textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapControlButton, { backgroundColor: dynamicStyles.backgroundColor }]}
            onPress={() => {
              const newRegion = {
                ...mapRegion,
                latitudeDelta: mapRegion.latitudeDelta * 2,
                longitudeDelta: mapRegion.longitudeDelta * 2,
              };
              mapRef.current?.animateToRegion(newRegion, 500);
            }}
          >
            <Icon name="minus" size={20} color={dynamicStyles.textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapControlButton, { backgroundColor: dynamicStyles.backgroundColor }]}
            onPress={() => {
              // Center on user's current location or default location
              const defaultRegion = {
                latitude: 5.6037,
                longitude: -0.187,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              };
              mapRef.current?.animateToRegion(defaultRegion, 1000);
            }}
          >
            <Icon name="crosshair" size={20} color={dynamicStyles.textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={dynamicStyles.primaryColor} />
          <Text style={[styles.loadingText, { color: dynamicStyles.mutedText }]}>
            Loading locations...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {allDisplayLocations.length > 0 ? (
            allDisplayLocations.map((location) => 
              location.isSearchResult ? renderSearchResultCard(location) : renderLocationCard(location)
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="map-pin" size={64} color={dynamicStyles.mutedText} />
              <Text style={[styles.emptyText, { color: dynamicStyles.textColor }]}>
                No locations found
              </Text>
              <Text style={[styles.emptySubtext, { color: dynamicStyles.mutedText }]}>
                {searchText ? 'Try adjusting your search terms' : 'Add your first location to get started'}
              </Text>
              {!searchText && (
                <TouchableOpacity
                  style={[styles.addFirstLocationButton, { backgroundColor: dynamicStyles.primaryColor }]}
                  onPress={() => navigation.navigate('AddLocation')}
                >
                  <Icon name="plus" size={20} color="#ffffff" />
                  <Text style={styles.addFirstLocationButtonText}>Add Location</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      {/* Footer Navigation */}
      <View style={[styles.footer, { backgroundColor: dynamicStyles.backgroundColor, borderTopColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Report")}
        >
          <Icon name="file-plus" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
          onPress={() => navigation.navigate("Locations")}
        >
          <Icon name="map-pin" size={24} color={dynamicStyles.primaryColor} />
          <Text style={[styles.footerButtonText, styles.footerButtonTextActive, { color: dynamicStyles.primaryColor }]}>
            Locations
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 20,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  locationCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  cardHeaderContent: {
    flex: 1,
  },
  locationName: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 4,
  },
  locationType: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  calloutStatus: {
    fontSize: 12,
    color: "#637588",
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#637588",
    marginBottom: 8,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  calloutButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    top: 12,
    gap: 8,
  },
  mapControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  addFirstLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  addFirstLocationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "space-around",
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  footerButtonActive: {},
  footerButtonTextActive: {
    fontWeight: "700",
  },
  searchToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placesSearchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placesSearchContainer: {
    flex: 1,
  },
  placesSearchIcon: {
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePlacesSearch: {
    paddingRight: 12,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLocationButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  addLocationButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

