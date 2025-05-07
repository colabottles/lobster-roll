import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LobsterShackService } from '../../services/lobster-shack.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-bar">
        <div class="search-input-container">
          <label>Search for Lobster Shacks</label>
          <input 
            type="text" 
            class="search-input" 
            placeholder="e.g., The Lobster Shack, Portland, Maine..." 
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
          >
          <button 
            class="search-button" 
            (click)="search()"
            aria-label="Search"
          >
            🔍
          </button>
        </div>
        <button 
          class="location-button" 
          (click)="findNearMe()"
          aria-label="Find near me"
        >
          📍 Near Me
        </button>
      </div>
      <div class="filters">
        <div class="filter-group">
          <label>Price:</label>
          <div class="filter-buttons">
            <button 
              *ngFor="let price of priceOptions" 
              [class.active]="selectedPrice === price.value"
              (click)="filterByPrice(price.value)"
            >
              {{ price.label }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <label>Rating:</label>
          <div class="filter-buttons">
            <button 
              *ngFor="let rating of ratingOptions" 
              [class.active]="selectedRating === rating.value"
              (click)="filterByRating(rating.value)"
            >
              {{ rating.label }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <label>Sort by:</label>
          <div class="filter-buttons">
            <button 
              [class.active]="sortBy === 'distance'"
              (click)="sortByDistance()"
            >
              Distance
            </button>
            <button 
              [class.active]="sortBy === 'rating'"
              (click)="sortByRating()"
            >
              Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      background-color: white;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }

    .search-bar {
      display: flex;
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }

    .search-input-container {
      position: relative;
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: var(--space-1) var(--space-1) var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      border: 2px solid var(--neutral-200);
      font-size: var(--font-size-md);
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--secondary-400);
      box-shadow: 0 0 0 3px rgba(69, 123, 157, 0.2);
    }

    .search-button {
      position: absolute;
      right: var(--space-1);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-lg);
    }

    .location-button {
      white-space: nowrap;
      background-color: var(--secondary-500);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: 0 var(--space-2);
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: var(--font-size-md);
    }

    .location-button:hover {
      background-color: var(--secondary-600);
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .filter-group label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-dark);
    }

    .filter-buttons {
      display: flex;
      gap: 2px;
    }

    .filter-buttons button {
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-200);
      padding: 0.25rem 0.5rem;
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-buttons button:first-child {
      border-top-left-radius: var(--radius-sm);
      border-bottom-left-radius: var(--radius-sm);
    }

    .filter-buttons button:last-child {
      border-top-right-radius: var(--radius-sm);
      border-bottom-right-radius: var(--radius-sm);
    }

    .filter-buttons button.active {
      background-color: var(--secondary-500);
      color: white;
      border-color: var(--secondary-600);
    }

    .filter-buttons button:hover:not(.active) {
      background-color: var(--neutral-200);
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        gap: var(--space-1);
      }

      .search-bar {
        flex-direction: column;
      }

      .location-button {
        width: 100%;
        padding: var(--space-1);
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  selectedPrice: number | null = null;
  selectedRating: number | null = null;
  sortBy: 'distance' | 'rating' = 'distance';

  priceOptions = [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' },
    { value: 5, label: '$$$$$' }
  ];

  ratingOptions = [
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 4.5, label: '4.5+' }
  ];

  constructor(
    private lobsterShackService: LobsterShackService,
    private mapService: MapService
  ) { }

  ngOnInit(): void { }

  search(): void {
    if (this.searchQuery.trim() !== '') {
      this.lobsterShackService.searchShacks(this.searchQuery).subscribe();
    } else {
      this.lobsterShackService.getShacks().subscribe();
    }
  }

  findNearMe(): void {
    this.mapService.getUserLocation();
    this.sortByDistance();
  }

  filterByPrice(price: number): void {
    if (this.selectedPrice === price) {
      this.selectedPrice = null;
      this.lobsterShackService.getShacks().subscribe();
    } else {
      this.selectedPrice = price;
      this.lobsterShackService.filterByPrice(price).subscribe();
    }
  }

  filterByRating(rating: number): void {
    if (this.selectedRating === rating) {
      this.selectedRating = null;
      this.lobsterShackService.getShacks().subscribe();
    } else {
      this.selectedRating = rating;
      this.lobsterShackService.filterByRating(rating).subscribe();
    }
  }

  sortByDistance(): void {
    this.sortBy = 'distance';
    this.lobsterShackService.sortByDistance().subscribe();
  }

  sortByRating(): void {
    this.sortBy = 'rating';
    this.lobsterShackService.sortByRating().subscribe();
  }
}