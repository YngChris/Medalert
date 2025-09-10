import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATIONS_STORAGE_KEY = '@medalert_locations';

// Default locations for initial setup
const defaultLocations = [
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
    isUserAdded: false,
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
    isUserAdded: false,
  },
];

class LocationsStorage {
  // Get all locations
  async getAllLocations() {
    try {
      const jsonValue = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      // If no locations exist, initialize with default locations
      await this.initializeDefaultLocations();
      return defaultLocations;
    } catch (error) {
      console.error('Error getting locations:', error);
      return defaultLocations;
    }
  }

  // Initialize default locations
  async initializeDefaultLocations() {
    try {
      const jsonValue = JSON.stringify(defaultLocations);
      await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, jsonValue);
      return defaultLocations;
    } catch (error) {
      console.error('Error initializing default locations:', error);
      throw error;
    }
  }

  // Add a new location
  async addLocation(locationData) {
    try {
      const existingLocations = await this.getAllLocations();
      const newLocation = {
        id: Date.now().toString(),
        ...locationData,
        isUserAdded: true,
        status: locationData.status || "Clear",
        rating: locationData.rating || 0,
        distance: locationData.distance || "Unknown",
        image: locationData.image || "https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=LOC",
      };
      
      const updatedLocations = [newLocation, ...existingLocations];
      const jsonValue = JSON.stringify(updatedLocations);
      await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, jsonValue);
      return newLocation;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  // Update a location
  async updateLocation(locationId, updatedData) {
    try {
      const existingLocations = await this.getAllLocations();
      const updatedLocations = existingLocations.map(location =>
        location.id === locationId ? { ...location, ...updatedData } : location
      );
      
      const jsonValue = JSON.stringify(updatedLocations);
      await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, jsonValue);
      return updatedLocations.find(location => location.id === locationId);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  // Delete a location (only user-added locations)
  async deleteLocation(locationId) {
    try {
      const existingLocations = await this.getAllLocations();
      const locationToDelete = existingLocations.find(loc => loc.id === locationId);
      
      if (locationToDelete && !locationToDelete.isUserAdded) {
        throw new Error('Cannot delete default locations');
      }
      
      const updatedLocations = existingLocations.filter(location => location.id !== locationId);
      const jsonValue = JSON.stringify(updatedLocations);
      await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, jsonValue);
      return locationToDelete;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  // Get user-added locations only
  async getUserAddedLocations() {
    try {
      const allLocations = await this.getAllLocations();
      return allLocations.filter(location => location.isUserAdded);
    } catch (error) {
      console.error('Error getting user-added locations:', error);
      return [];
    }
  }

  // Clear all locations (for testing purposes)
  async clearAllLocations() {
    try {
      await AsyncStorage.removeItem(LOCATIONS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing locations:', error);
      throw error;
    }
  }
}

export const locationsStorage = new LocationsStorage();
export default locationsStorage;
