import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { LobsterShackService } from '../../services/lobster-shack.service';
import { MapService } from '../../services/map.service';
import { LobsterShack } from '../../models/lobster-shack.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div id="map"></div>
      <div class="map-controls">
        <button class="map-btn" (click)="centerOnUser()" title="Find my location">
          <span>📍</span>
        </button>
        <button class="map-btn" (click)="resetView()" title="Reset view">
          <span>🏠</span>
        </button>
      </div>
      <div *ngIf="loading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    #map {
      height: 100%;
      width: 100%;
      z-index: 1;
    }

    .map-controls {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .map-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: white;
      border: none;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .map-btn:hover {
      transform: scale(1.05);
    }

    .map-btn span {
      font-size: 1.2rem;
    }

    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(255, 255, 255, 0.9);
      padding: var(--space-2);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: var(--shadow-md);
      z-index: 10;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--neutral-200);
      border-top: 4px solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-1);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .map-container {
        height: 300px;
      }
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private subscriptions: Subscription[] = [];
  private selectedMarker: L.Marker | null = null;
  loading = true;

  constructor(
    private lobsterShackService: LobsterShackService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to selected shack changes
    this.subscriptions.push(
      this.lobsterShackService.selectedShackId$.subscribe(id => {
        if (id !== null) {
          this.lobsterShackService.getShackById(id).subscribe(shack => {
            if (shack) {
              this.highlightMarker(shack);
            }
          });
        } else {
          this.clearHighlightedMarker();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialize map with default location
    this.subscriptions.push(
      this.mapService.currentLocation$.subscribe(location => {
        if (!this.map) {
          this.map = L.map('map').setView([location.lat, location.lng], location.zoom);
          
          // Add tile layer (OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(this.map);
          
          // Load shacks and add markers
          this.loadShacks();
        } else {
          this.map.setView([location.lat, location.lng], location.zoom);
        }
      })
    );

    // Subscribe to user location changes
    this.subscriptions.push(
      this.mapService.userLocation$.subscribe(location => {
        if (location && this.map) {
          // Add or update user location marker
          this.addUserLocationMarker(location);
        }
      })
    );
  }

  private loadShacks(): void {
    this.subscriptions.push(
      this.lobsterShackService.getShacks().subscribe(shacks => {
        this.addMarkersToMap(shacks);
        this.loading = false;
      })
    );
  }

  private addMarkersToMap(shacks: LobsterShack[]): void {
    // Clear existing markers
    this.clearMarkers();
    
    // Create custom icon for lobster shacks
    const customIcon = L.divIcon({
      html: `<div class="custom-marker"><span>🦞</span></div>`,
      className: 'lobster-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Create style for custom markers
    const markerStyle = document.createElement('style');
    markerStyle.textContent = `
      .custom-marker {
        width: 40px;
        height: 40px;
        background-color: var(--primary-500);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
        transition: transform 0.2s ease;
      }
      .custom-marker:hover {
        transform: scale(1.1);
      }
      .custom-marker span {
        font-size: 1.5rem;
      }
      .highlighted-marker {
        transform: scale(1.2);
        background-color: var(--accent-500);
        z-index: 1000 !important;
      }
    `;
    document.head.appendChild(markerStyle);

    // Add markers for each shack
    shacks.forEach(shack => {
      const marker = L.marker([shack.location.lat, shack.location.lng], { icon: customIcon })
        .addTo(this.map);
      
      // Create popup content
      const popupContent = `
        <div class="popup-content">
          <h3>${shack.name}</h3>
          <div class="rating">
            ${'★'.repeat(Math.floor(shack.rating))}${'☆'.repeat(5 - Math.floor(shack.rating))}
            <span>${shack.rating.toFixed(1)}</span>
          </div>
          <p class="price">${'$'.repeat(shack.price)}</p>
          ${shack.distance ? `<p class="distance">${shack.distance} miles away</p>` : ''}
          <button class="view-details-btn">View Details</button>
        </div>
      `;
      
      // Add popup style
      const popupStyle = document.createElement('style');
      popupStyle.textContent = `
        .popup-content {
          padding: 0.5rem;
          font-family: var(--font-family);
        }
        .popup-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--primary-600);
        }
        .rating {
          color: var(--warning-500);
          margin-bottom: 0.5rem;
        }
        .rating span {
          color: var(--text-dark);
          margin-left: 0.25rem;
        }
        .price {
          color: var(--success-600);
          margin-bottom: 0.25rem;
        }
        .distance {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .view-details-btn {
          background-color: var(--secondary-500);
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          width: 100%;
          font-family: var(--font-family);
          transition: background-color 0.2s ease;
        }
        .view-details-btn:hover {
          background-color: var(--secondary-600);
        }
      `;
      document.head.appendChild(popupStyle);
      
      // Bind popup to marker
      marker.bindPopup(popupContent);
      
      // Store the shack ID with the marker for reference
      (marker as any).shackId = shack.id;
      
      // Add click event to marker
      marker.on('click', (e) => {
        const popup = e.target.getPopup();
        
        // Add click event to the View Details button after popup is opened
        marker.on('popupopen', () => {
          const button = document.querySelector('.view-details-btn');
          if (button) {
            button.addEventListener('click', () => {
              this.router.navigate(['/shack', shack.id]);
            });
          }
        });

        // Select the shack when marker is clicked
        this.lobsterShackService.setSelectedShackId(shack.id);
      });
      
      // Store marker for later reference
      this.markers.push(marker);
    });
  }

  private addUserLocationMarker(location: {lat: number, lng: number}): void {
    // Create custom icon for user location
    const userIcon = L.divIcon({
      html: `<div class="user-marker"><span>📍</span></div>`,
      className: 'user-location-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    // Create style for user marker
    const userMarkerStyle = document.createElement('style');
    userMarkerStyle.textContent = `
      .user-marker {
        width: 30px;
        height: 30px;
        background-color: var(--secondary-500);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
        animation: pulse 2s infinite;
      }
      .user-marker span {
        font-size: 1rem;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(userMarkerStyle);

    // Add user location marker
    const userMarker = L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(this.map);
    
    userMarker.bindPopup("You are here").openPopup();
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  private highlightMarker(shack: LobsterShack): void {
    // Clear previous highlight
    this.clearHighlightedMarker();
    
    // Find the marker for this shack
    const marker = this.markers.find(m => (m as any).shackId === shack.id);
    
    if (marker) {
      // Center map on marker
      this.map.setView([shack.location.lat, shack.location.lng], 14);
      
      // Highlight the marker
      const markerElement = marker.getElement();
      if (markerElement) {
        const iconElement = markerElement.querySelector('.custom-marker');
        if (iconElement) {
          iconElement.classList.add('highlighted-marker');
        }
      }
      
      // Open the popup
      marker.openPopup();
      
      // Store the highlighted marker
      this.selectedMarker = marker;
    }
  }

  private clearHighlightedMarker(): void {
    if (this.selectedMarker) {
      const markerElement = this.selectedMarker.getElement();
      if (markerElement) {
        const iconElement = markerElement.querySelector('.custom-marker');
        if (iconElement) {
          iconElement.classList.remove('highlighted-marker');
        }
      }
      this.selectedMarker = null;
    }
  }

  centerOnUser(): void {
    this.mapService.getUserLocation();
  }

  resetView(): void {
    this.mapService.resetView();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Destroy map if it exists
    if (this.map) {
      this.map.remove();
    }
  }
}