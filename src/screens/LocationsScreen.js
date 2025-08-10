<<<<<<<< HEAD:screens/LocationsScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
========
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
>>>>>>>> 907b8b32424538cf3783879dfe3835e04dc19984:src/screens/LocationsScreen.js

const locationsData = [
  { id: "1", name: "Pharmacy A", status: "Flagged", lat: 5.6037, lng: -0.187 },
  { id: "2", name: "Clinic B", status: "Under Review", lat: 5.609, lng: -0.19 },
  { id: "3", name: "Hospital C", status: "Flagged", lat: 5.6105, lng: -0.185 },
  {
    id: "4",
    name: "Wellness Center D",
    status: "Clear",
    lat: 5.615,
    lng: -0.2,
  },
];

const LocationsScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const [mainSearchText, setMainSearchText] = useState("");
  const [mapSearchText, setMapSearchText] = useState("");

  const filteredLocations = locationsData.filter((location) =>
    location.name.toLowerCase().includes(mainSearchText.toLowerCase())
  );

  const handleMapSearch = () => {
    const match = locationsData.find((loc) =>
      loc.name.toLowerCase().includes(mapSearchText.toLowerCase())
    );
    if (match && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: match.lat,
          longitude: match.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleAddLocation = () => {
    // Add logic to navigate or open form
    alert("Add new location action");
  };

  const handleRemoveLocation = () => {
    // Add logic to remove selected location
    alert("Remove location action");
  };

  const handleNavigate = () => {
    // Add navigation logic
    alert("Navigate action");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Locations</Text>

      <View style={styles.searchSection}>
        <View style={styles.searchInputWrapper}>
          <Icon
            name="search"
            size={24}
            color="#637588"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations"
            placeholderTextColor="#637588"
            value={mainSearchText}
            onChangeText={setMainSearchText}
          />
        </View>
      </View>

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
            />
          ))}
        </MapView>

        <View style={styles.mapOverlay}>
          <View style={styles.backgroundSearchInputWrapper}>
            <Icon
              name="search"
              size={24}
              color="#637588"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.backgroundSearchInput}
              placeholder="Search on map"
              placeholderTextColor="#637588"
              value={mapSearchText}
              onChangeText={(text) => {
                setMapSearchText(text);
                handleMapSearch();
              }}
            />
          </View>

          <View style={styles.backgroundButtons}>
            <TouchableOpacity
              style={styles.backgroundButton}
              onPress={handleAddLocation}
            >
              <Icon name="plus" size={24} color="#111418" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backgroundButton}
              onPress={handleRemoveLocation}
            >
              <Icon name="minus" size={24} color="#111418" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backgroundButton}
              onPress={handleNavigate}
            >
              <Icon
                name="navigation"
                size={24}
                color="#111418"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, marginHorizontal: 16 }}>
        {filteredLocations.map((item) => (
          <View key={item.id} style={styles.locationCard}>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationStatus}>{item.status}</Text>
          </View>
        ))}
      </ScrollView>
<<<<<<<< HEAD:screens/LocationsScreen.js
        {/* Footer Navigation */}
              <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Report')}>
                  <Icon name="file-plus" size={24} color="#677583" />
                  <Text style={styles.footerButtonText}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]} onPress={() => navigation.navigate('Locations')}>
                  <Icon name="map-pin" size={24} color="#121417" />
                  <Text style={[styles.footerButtonText, styles.footerButtonTextActive]}>Locations</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Alerts')}>
                  <Icon name="bell" size={24} color="#677583" /> 
                  <Text style={styles.footerButtonText}>Alerts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Education')}>
                  <Icon name="book-open" size={24} color="#677583" />
                  <Text style={styles.footerButtonText}>Education</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Forum')}>
                  <Icon name="users" size={24} color="#677583" />
                  <Text style={styles.footerButtonText}>Forum</Text>
                </TouchableOpacity>
              </View>
    </View> 
========
    </SafeAreaView>
>>>>>>>> 907b8b32424538cf3783879dfe3835e04dc19984:src/screens/LocationsScreen.js
  );
};

export default LocationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111418",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f4f7",
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
    color: "#111418",
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 12,
  },
  backgroundSearchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f4f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  backgroundSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111418",
  },
  backgroundButtons: {
    flexDirection: "row",
    marginLeft: 12,
  },
  backgroundButton: {
    backgroundColor: "#e0e4ea",
    padding: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  locationCard: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  locationName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111418",
  },
  locationStatus: {
    fontSize: 14,
    color: "#637588",
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f4',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#121417',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerButtonActive: {},
});
