import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LobsterShack } from '../models/lobster-shack.model';

export interface MapLocation {
  lat: number;
  lng: number;
  zoom: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private defaultLocation: MapLocation = {
    lat: 43.661,
    lng: -70.255, // Portland, Maine coordinates
    zoom: 9
  };

  private locationSubject = new BehaviorSubject<MapLocation>(this.defaultLocation);
  currentLocation$ = this.locationSubject.asObservable();

  private userLocationSubject = new BehaviorSubject<{lat: number, lng: number} | null>(null);
  userLocation$ = this.userLocationSubject.asObservable();

  constructor() {
    this.getUserLocation();
  }

  setLocation(location: MapLocation): void {
    this.locationSubject.next(location);
  }

  centerOnShack(shack: LobsterShack): void {
    this.locationSubject.next({
      lat: shack.location.lat,
      lng: shack.location.lng,
      zoom: 14
    });
  }

  resetView(): void {
    this.locationSubject.next(this.defaultLocation);
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.userLocationSubject.next(userLocation);
          
          // Update map view to user location
          this.locationSubject.next({
            lat: userLocation.lat,
            lng: userLocation.lng,
            zoom: 11
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Fall back to default location
          this.userLocationSubject.next(null);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.userLocationSubject.next(null);
    }
  }
}