import { Routes } from '@angular/router';
import { App } from './app.component';
import { LobsterShackDetailComponent } from './components/lobster-shack-detail/lobster-shack-detail.component';

export const ROUTES: Routes = [
  { 
    path: '', 
    component: App 
  },
  { 
    path: 'shack/:id', 
    component: LobsterShackDetailComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];