import React, { useState, useRef } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';
import MapView, { Marker, Callout } from "react-native-maps";

// Enhanced location data
const locationsData = [
  {
    id: "1",
    name: "MediCare Pharmacy",
    type: "Pharmacy",
    status: "Clear",
    rating: 4.8,
    distance: "0.2 km",
    address: "123 Main Street, Accra",
    phone: "+233 20 123 4567",
    lat: 5.6037,
    lng: -0.187,
    image: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=PH",
  },
  {
    id: "2",
    name: "Accra Medical Clinic",
    type: "Clinic",
    status: "Under Review",
    rating: 4.2,
    distance: "0.5 km",
    address: "456 Oak Avenue, Accra",
    phone: "+233 20 234 5678",
    lat: 5.609,
    lng: -0.19,
    image: "https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=CL",
  },
  {
    id: "3",
    name: "Ghana General Hospital",
    type: "Hospital",
    status: "Flagged",
    rating: 3.9,
    distance: "1.2 km",
    address: "789 Pine Lane, Accra",
    phone: "+233 20 345 6789",
    lat: 5.6105,
    lng: -0.185,
    image: "https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=HO",
  },
  {
    id: "4",
    name: "Wellness Plus Center",
    type: "Wellness Center",
    status: "Clear",
    rating: 4.6,
    distance: "1.8 km",
    address: "321 Elm Street, Accra",
    phone: "+233 20 456 7890",
    lat: 5.615,
    lng: -0.2,
    image: "https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=WC",
  },
  {
    id: "5",
    name: "Community Drug Store",
    type: "Pharmacy",
    status: "Warning",
    rating: 3.5,
    distance: "2.1 km",
    address: "654 Maple Road, Accra",
    phone: "+233 20 567 8901",
    lat: 5.618,
    lng: -0.195,
    image: "https://via.placeholder.com/150x150/FFE66D/FFFFFF?text=DS",
  }
];

const LocationsScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  // Filter locations based on search
  const filteredLocations = locationsData.filter((location) =>
    location.name.toLowerCase().includes(searchText.toLowerCase()) ||
    location.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
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

        <View style={{ width: 48 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchInputWrapper, { backgroundColor: dynamicStyles.inputBackground }]}>
          <Icon
            name="search"
            size={20}
            color={dynamicStyles.mutedText}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: dynamicStyles.textColor }]}
            placeholder="Search locations..."
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
      </View>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={[styles.resultsText, { color: dynamicStyles.mutedText }]}>
          {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 5.6037,
            longitude: -0.187,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{ latitude: location.lat, longitude: location.lng }}
              title={location.name}
              description={location.status}
              onPress={() => setSelectedLocation(location)}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{location.name}</Text>
                  <Text style={styles.calloutStatus}>{location.status}</Text>
                  <Text style={styles.calloutAddress}>{location.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Locations List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredLocations.map(renderLocationCard)}
        <View style={styles.bottomSpacing} />
      </ScrollView>

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
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Alerts")}
        >
          <Icon name="bell" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Education")}
        >
          <Icon name="book-open" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Education</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Forum")}
        >
          <Icon name="users" size={24} color={dynamicStyles.mutedText} />
          <Text style={[styles.footerButtonText, { color: dynamicStyles.mutedText }]}>Forum</Text>
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
  },
  bottomSpacing: {
    height: 20,
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
});

