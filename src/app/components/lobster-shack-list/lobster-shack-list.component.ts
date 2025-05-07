import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LobsterShackService } from '../../services/lobster-shack.service';
import { MapService } from '../../services/map.service';
import { LobsterShack } from '../../models/lobster-shack.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobster-shack-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-container">
      <div class="list-header">
        <h2>Lobster Roll Shacks</h2>
        <span class="shack-count">{{ shacks.length }} found</span>
      </div>
      
      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Finding the freshest lobster rolls...</p>
      </div>
      
      <div *ngIf="!loading && shacks.length === 0" class="no-results">
        <p>No lobster roll shacks found with your criteria.</p>
        <button class="reset-btn" (click)="resetFilters()">Reset Filters</button>
      </div>
      
      <ul *ngIf="!loading && shacks.length > 0" class="shack-list">
        <li *ngFor="let shack of shacks" 
            class="shack-item"
            [class.selected]="selectedShackId === shack.id"
            (click)="selectShack(shack)">
          
          <div class="shack-header">
            <h3>{{ shack.name }}</h3>
            <button 
              class="favorite-btn" 
              [class.active]="shack.isFavorite"
              (click)="toggleFavorite($event, shack.id)">
              <span>{{ shack.isFavorite ? '❤️' : '🤍' }}</span>
            </button>
          </div>
          
          <div class="shack-details">
            <div class="rating-price">
              <div class="rating">
                <span class="stars">{{ getStarRating(shack.rating) }}</span>
                <span class="rating-value">{{ shack.rating.toFixed(1) }}</span>
                <span class="review-count">({{ shack.reviewCount }})</span>
              </div>
              <div class="price">{{ getPriceSymbols(shack.price) }}</div>
            </div>
            
            <div class="location">
              <span>{{ shack.city }}, {{ shack.state }}</span>
              <span *ngIf="shack.distance" class="distance">{{ shack.distance }} mi</span>
            </div>
            
            <div class="tags">
              <span *ngFor="let tag of shack.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
          
          <div class="shack-actions">
            <button class="view-btn" (click)="viewDetails($event, shack.id)">View Details</button>
            <button class="locate-btn" (click)="locateOnMap($event, shack)">Show on Map</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .list-container {
      height: 100%;
      width: 100%;
      background-color: white;
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-md);
    }

    .list-header {
      padding: var(--space-2);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-header h2 {
      margin: 0;
      color: var(--primary-600);
    }

    .shack-count {
      color: var(--text-dark);
      font-size: var(--font-size-sm);

    }

    .loading, .no-results {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      text-align: center;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid var(--neutral-200);
      border-top: 5px solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-2);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .reset-btn {
      margin-top: var(--space-2);
      background-color: var(--secondary-500);
      color: white;
      border: none;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      cursor: pointer;
    }

    .shack-list {
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
      flex: 1;
    }

    .shack-item {
      padding: var(--space-2);
      border-bottom: 1px solid var(--neutral-200);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .shack-item:hover {
      background-color: var(--neutral-50);
    }

    .shack-item.selected {
      background-color: rgba(234, 88, 95, 0.1);
      border-left: 4px solid var(--primary-500);
    }

    .shack-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-1);
    }

    .shack-header h3 {
      margin: 0;
      color: var(--primary-700);
      font-size: var(--font-size-lg);
    }

    .favorite-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-xl);
      line-height: 1;
      transition: transform 0.2s ease;
    }

    .favorite-btn:hover {
      transform: scale(1.2);
    }

    .shack-details {
      margin-bottom: var(--space-1);
    }

    .rating-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-1);
    }

    .rating {
      display: flex;
      align-items: center;
    }

    .stars {
      color: var(--warning-500);
      margin-right: var(--space-1);
    }

    .rating-value {
      font-weight: var(--font-weight-medium);
      margin-right: 4px;
    }

    .review-count {
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }

    .price {
      color: var(--success-600);
      font-weight: var(--font-weight-medium);
    }

    .location {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-1);
    }

    .distance {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: var(--space-1);
    }

    .tag {
      background-color: var(--neutral-100);
      color: var(--text-dark);
      font-size: var(--font-size-xs);
      padding: 2px 8px;
      border-radius: 12px;
    }

    .shack-actions {
      display: flex;
      gap: var(--space-1);
    }

    .view-btn, .locate-btn {
      flex: 1;
      padding: var(--space-1);
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: background-color 0.2s ease;
      min-width: 80px;
    }

    .view-btn {
      background-color: var(--primary-700);
      color: white;
    }

    .view-btn:hover {
      background-color: var(--primary-600);
    }

    .locate-btn {
      background-color: var(--secondary-500);
      color: white;
    }

    .locate-btn:hover {
      background-color: var(--secondary-600);
    }

    @media (max-width: 768px) {
      .list-container {
        height: 400px;
      }
    }
  `]
})
export class LobsterShackListComponent implements OnInit, OnDestroy {
  shacks: LobsterShack[] = [];
  loading = true;
  private subscriptions: Subscription[] = [];
  selectedShackId: number | null = null;

  constructor(
    private lobsterShackService: LobsterShackService,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load initial shacks
    this.subscriptions.push(
      this.lobsterShackService.shacks$.subscribe(shacks => {
        this.shacks = shacks;
        this.loading = false;
      })
    );

    // Subscribe to selected shack changes
    this.subscriptions.push(
      this.lobsterShackService.selectedShackId$.subscribe(id => {
        this.selectedShackId = id;
      })
    );

    // Initial load
    this.lobsterShackService.getShacks().subscribe();
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return '★'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
  }

  getPriceSymbols(price: number): string {
    return '$'.repeat(price);
  }

  toggleFavorite(event: Event, id: number): void {
    event.stopPropagation();
    this.lobsterShackService.toggleFavorite(id);
  }

  viewDetails(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/shack', id]);
  }

  locateOnMap(event: Event, shack: LobsterShack): void {
    event.stopPropagation();
    this.mapService.centerOnShack(shack);
    this.lobsterShackService.setSelectedShackId(shack.id);
  }

  selectShack(shack: LobsterShack): void {
    this.lobsterShackService.setSelectedShackId(shack.id);
    this.mapService.centerOnShack(shack);
  }

  resetFilters(): void {
    this.lobsterShackService.getShacks().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}