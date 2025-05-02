import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { LobsterShackListComponent } from './components/lobster-shack-list/lobster-shack-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MapComponent,
    SearchComponent,
    LobsterShackListComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content">
        <app-search></app-search>
        <div class="map-list-container">
          <app-map></app-map>
          <app-lobster-shack-list></app-lobster-shack-list>
        </div>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: var(--space-2);
    }

    .map-list-container {
      display: flex;
      gap: var(--space-2);
      height: calc(100vh - 200px);
      margin-top: var(--space-2);
    }
    
    @media (max-width: 768px) {
      .map-list-container {
        flex-direction: column;
        height: auto;
      }
    }
  `]
})
export class App {
  title = 'Lobster Roll Finder';
}