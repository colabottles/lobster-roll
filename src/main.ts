import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app.component';
import { ROUTES } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(ROUTES),
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));