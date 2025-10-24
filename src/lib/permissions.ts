import { Geolocation } from '@capacitor/geolocation';

export class PermissionService {
  /**
   * Request location permissions from the user
   * @returns Promise resolving to true if permissions granted, false otherwise
   */
  static async requestLocationPermissions(): Promise<boolean> {
    try {
      // Check if we already have permission
      const status = await Geolocation.checkPermissions();
      
      if (status.location === 'granted') {
        return true;
      }
      
      // Request permission
      const permissionStatus = await Geolocation.requestPermissions();
      
      return permissionStatus.location === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Get current position if permissions are granted
   * @returns Promise resolving to position coordinates or null
   */
  static async getCurrentPosition(): Promise<GeolocationPosition | null> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      
      if (!hasPermission) {
        return null;
      }
      
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
      
      return position;
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  /**
   * Watch position changes
   * @param callback Function to call when position changes
   * @returns Promise resolving to watcher ID
   */
  static async watchPosition(callback: (position: GeolocationPosition | null) => void): Promise<string | null> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      
      if (!hasPermission) {
        return null;
      }
      
      const id = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }, (position, err) => {
        if (err) {
          console.error('Error watching position:', err);
          callback(null);
        } else {
          callback(position);
        }
      });
      
      return id;
    } catch (error) {
      console.error('Error watching position:', error);
      return null;
    }
  }

  /**
   * Clear position watcher
   * @param id Watcher ID to clear
   */
  static clearWatch(id: string): void {
    Geolocation.clearWatch({ id });
  }
}