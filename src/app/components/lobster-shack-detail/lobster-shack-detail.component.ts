import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LobsterShackService } from '../../services/lobster-shack.service';
import { LobsterShack } from '../../models/lobster-shack.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-lobster-shack-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  template: `
    <div class="detail-page">
      <app-header></app-header>
      
      <div class="container">
        <button class="back-button" (click)="goBack()">← Back to Map</button>
        
        <div *ngIf="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>Loading shack details...</p>
        </div>
        
        <div *ngIf="!loading && !shack" class="not-found">
          <h2>Shack Not Found</h2>
          <p>We couldn't find the lobster roll shack you're looking for.</p>
          <button class="back-button" (click)="goBack()">Back to Map</button>
        </div>
        
        <div *ngIf="shack" class="shack-detail fade-in">
          <div class="detail-header">
            <div class="header-content">
              <h1>{{ shack.name }}</h1>
              <div class="rating-row">
                <div class="rating">
                  <span class="stars">{{ getStarRating(shack.rating) }}</span>
                  <span class="rating-value">{{ shack.rating.toFixed(1) }}</span>
                </div>
                <span class="review-count">{{ shack.reviewCount }} reviews</span>
                <span class="price">{{ getPriceSymbols(shack.price) }}</span>
              </div>
              <div class="tags">
                <span *ngFor="let tag of shack.tags" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="favorite-container">
              <button 
                class="favorite-btn" 
                [class.active]="shack.isFavorite"
                (click)="toggleFavorite(shack.id)">
                <span class="heart-icon">{{ shack.isFavorite ? '❤️' : '🤍' }}</span>
                <span>{{ shack.isFavorite ? 'Favorited' : 'Add to Favorites' }}</span>
              </button>
            </div>
          </div>
          
          <div class="photos">
            <div *ngFor="let photo of shack.photos" class="photo">
              <img [src]="photo" alt="Photo of {{ shack.name }}">
            </div>
          </div>
          
          <div class="detail-content">
            <div class="info-section">
              <h2>About</h2>
              <p>{{ shack.description }}</p>
            </div>
            
            <div class="location-section">
              <h2>Location</h2>
              <address>
                {{ shack.address }}<br>
                {{ shack.city }}, {{ shack.state }} {{ shack.zipCode }}
              </address>
              <p *ngIf="shack.distance" class="distance">{{ shack.distance }} miles away</p>
              <div class="contact-info">
                <p><strong>Phone:</strong> {{ shack.phone }}</p>
                <p *ngIf="shack.website">
                  <strong>Website:</strong> 
                  <a [href]="shack.website" target="_blank" rel="noopener noreferrer">{{ shack.website }}</a>
                </p>
              </div>
            </div>
            
            <div class="hours-section">
              <h2>Hours</h2>
              <ul class="hours-list">
                <li *ngFor="let day of daysOfWeek">
                  <span class="day">{{ day }}:</span>
                  <span class="hours">{{ shack.hours[day] || 'Closed' }}</span>
                </li>
              </ul>
            </div>
            
            <div class="actions-section">
              <button class="action-btn directions-btn">
                <span>🧭</span> Get Directions
              </button>
              <button class="action-btn share-btn">
                <span>🔗</span> Share
              </button>
              <button class="action-btn report-btn">
                <span>🚩</span> Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .detail-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      flex: 1;
      padding: var(--space-3) var(--space-2);
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .back-button {
      background: none;
      border: none;
      color: var(--secondary-600);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      padding: var(--space-1) 0;
      margin-bottom: var(--space-2);
      transition: color 0.2s ease;
    }

    .back-button:hover {
      color: var(--secondary-800);
      text-decoration: underline;
    }

    .loading, .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
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

    .shack-detail {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .detail-header {
      background-color: var(--primary-500);
      color: white;
      padding: var(--space-3);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .header-content {
      flex: 1;
      min-width: 200px;
    }

    .detail-header h1 {
      margin: 0 0 var(--space-1) 0;
      color: white;
      font-size: var(--font-size-3xl);
    }

    .rating-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-1) var(--space-2);
      margin-bottom: var(--space-1);
    }

    .rating {
      display: flex;
      align-items: center;
    }

    .stars {
      color: var(--accent-500);
      margin-right: 4px;
    }

    .rating-value {
      font-weight: var(--font-weight-bold);
    }

    .review-count {
      color: rgba(255, 255, 255, 0.9);
    }

    .price {
      color: var(--accent-400);
      font-weight: var(--font-weight-bold);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: var(--font-size-sm);
    }

    .favorite-container {
      min-width: 150px;
    }

    .favorite-btn {
      background-color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: var(--space-1) var(--space-2);
      display: flex;
      align-items: center;
      gap: var(--space-1);
      cursor: pointer;
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      transition: all 0.2s ease;
    }

    .favorite-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .favorite-btn.active {
      background-color: var(--primary-600);
      color: white;
    }

    .heart-icon {
      font-size: var(--font-size-lg);
    }

    .photos {
      display: flex;
      overflow-x: auto;
      gap: var(--space-1);
      padding: var(--space-1);
      scroll-snap-type: x mandatory;
    }

    .photo {
      flex: 0 0 auto;
      width: 300px;
      height: 200px;
      border-radius: var(--radius-md);
      overflow: hidden;
      scroll-snap-align: start;
      box-shadow: var(--shadow-sm);
    }

    .photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .photo:hover img {
      transform: scale(1.05);
    }

    .detail-content {
      padding: var(--space-3);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-3);
    }

    .info-section, .location-section, .hours-section, .actions-section {
      padding: var(--space-2);
      background-color: var(--neutral-50);
      border-radius: var(--radius-md);
    }

    .info-section h2, .location-section h2, .hours-section h2 {
      color: var(--primary-600);
      margin-top: 0;
      margin-bottom: var(--space-2);
      font-size: var(--font-size-xl);
    }

    .hours-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .hours-list li {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px dashed var(--neutral-300);
    }

    .hours-list li:last-child {
      border-bottom: none;
    }

    .day {
      font-weight: var(--font-weight-medium);
    }

    .actions-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .action-btn {
      background-color: white;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-md);
      padding: var(--space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      cursor: pointer;
      font-weight: var(--font-weight-medium);
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: var(--neutral-100);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .directions-btn {
      background-color: var(--secondary-500);
      color: white;
      border: none;
    }

    .directions-btn:hover {
      background-color: var(--secondary-600);
    }

    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
      }

      .favorite-container {
        width: 100%;
      }

      .favorite-btn {
        width: 100%;
        justify-content: center;
      }

      .photo {
        width: 250px;
        height: 170px;
      }
    }
  `]
})
export class LobsterShackDetailComponent implements OnInit {
  shack: LobsterShack | undefined;
  loading = true;
  daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lobsterShackService: LobsterShackService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadShackDetails(parseInt(id, 10));
      } else {
        this.loading = false;
      }
    });
  }

  loadShackDetails(id: number): void {
    this.lobsterShackService.getShackById(id).subscribe(shack => {
      this.shack = shack;
      this.loading = false;
    });
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

  toggleFavorite(id: number): void {
    this.lobsterShackService.toggleFavorite(id);
    if (this.shack) {
      this.shack.isFavorite = !this.shack.isFavorite;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}