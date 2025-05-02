import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-logo">
          <div class="logo">🦞</div>
          <p>Lobster Roll Finder</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h3>About</h3>
            <ul>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Submit a Shack</a></li>
              <li><a href="#">Lobster News</a></li>
              <li><a href="#">Cooking Tips</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="copyright">
        <div class="container">
          <p>&copy; {{ year }} Lobster Roll Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--secondary-800);
      color: var(--text-light);
      padding: var(--space-4) 0 0;
      margin-top: var(--space-4);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .footer-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      min-width: 200px;
    }

    .logo {
      font-size: 2.5rem;
    }

    .footer-logo p {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .link-group h3 {
      font-size: var(--font-size-md);
      margin-bottom: var(--space-2);
      color: var(--text-light);
    }

    .link-group ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .link-group li {
      margin-bottom: var(--space-1);
    }

    .link-group a {
      color: var(--neutral-200);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .link-group a:hover {
      color: var(--text-light);
      text-decoration: underline;
    }

    .copyright {
      border-top: 1px solid var(--secondary-700);
      padding: var(--space-2) 0;
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--neutral-300);
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: var(--space-3);
      }

      .footer-links {
        width: 100%;
        justify-content: space-between;
      }

      .link-group {
        min-width: 120px;
      }
    }

    @media (max-width: 480px) {
      .footer-links {
        flex-direction: column;
        gap: var(--space-2);
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  year: number = new Date().getFullYear();

  ngOnInit() {
    // No need to set year in ngOnInit since it's initialized at declaration
  }
}