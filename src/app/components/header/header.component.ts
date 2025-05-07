import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="container header-container">
        <div class="logo-container">
          <div class="logo">🦞</div>
          <h1>Lobster Roll Finder</h1>
        </div>
        <nav class="nav-menu">
          <ul>
            <li><a href="#" class="active">Find Rolls</a></li>
            <li><a href="#">Favorites</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>
        <button class="mobile-menu-btn" (click)="toggleMenu()">
          <span class="sr-only">Menu</span>
          <div class="hamburger" [class.open]="isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      <div class="mobile-nav" [class.open]="isMenuOpen">
        <ul>
          <li><a href="#" class="active">Find Rolls</a></li>
          <li><a href="#">Favorites</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--primary-700);
      color: var(--text-light);
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: var(--z-menu);
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .logo {
      font-size: 2rem;
      animation: pulse 2s infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h1 {
      font-size: var(--font-size-xl);
      margin: 0;
      white-space: nowrap;
      color: var(--text-light);
    }

    .nav-menu ul {
      display: flex;
      list-style: none;
      gap: var(--space-3);
    }

    .nav-menu a {
      color: var(--text-light);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      padding: 0.5rem;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-menu a:hover, .nav-menu a.active {
      color: var(--accent-100);
    }

    .nav-menu a.active::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent-400);
      transform-origin: center;
      transform: scaleX(1);
      transition: transform 0.3s ease;
    }

    .nav-menu a:not(.active)::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent-400);
      transform-origin: center;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .nav-menu a:hover::after {
      transform: scaleX(1);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-light);
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 20px;
    }

    .hamburger span {
      display: block;
      height: 2px;
      width: 100%;
      background-color: var(--text-light);
      transition: all 0.3s ease;
    }

    .hamburger.open span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }

    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.open span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }

    .mobile-nav {
      display: none;
      background-color: var(--primary-500);
      padding: var(--space-2) 0;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    }

    .mobile-nav.open {
      transform: translateY(0);
    }

    .mobile-nav ul {
      list-style: none;
      padding: 0 var(--space-2);
    }

    .mobile-nav li {
      margin-bottom: var(--space-2);
    }

    .mobile-nav a {
      color: var(--text-light);
      text-decoration: none;
      font-size: var(--font-size-lg);
      padding: var(--space-1) 0;
      display: block;
    }

    .mobile-nav a.active {
      color: var(--accent-100);
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }

      .mobile-nav {
        display: block;
      }

      h1 {
        font-size: var(--font-size-lg);
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}