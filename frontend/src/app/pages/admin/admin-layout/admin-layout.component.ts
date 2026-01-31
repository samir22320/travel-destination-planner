import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <header class="top-bar">
        <div class="brand-section">
          <div class="brand">TraveLuxe Admin</div>
          <nav class="top-nav">
            <a routerLink="/admin/dashboard" routerLinkActive="active">Search Countries</a>
            <a routerLink="/admin/manage" routerLinkActive="active">
              Manage Database
              <span class="badge" *ngIf="count !== null">{{count}}</span>
            </a>
          </nav>
        </div>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; flex-direction: column; height: 100vh; font-family: 'Inter', sans-serif; }
    .top-bar { background: #0f172a; color: white; padding: 0 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); height: 70px; }
    
    .brand-section { display: flex; align-items: center; gap: 40px; }
    .brand { font-size: 1.5rem; font-weight: bold; color: #38bdf8; }
    
    .top-nav { display: flex; gap: 20px; }
    .top-nav a { color: #94a3b8; text-decoration: none; font-weight: 500; font-size: 0.95rem; padding: 22px 0; border-bottom: 3px solid transparent; transition: all 0.3s; }
    .top-nav a:hover { color: #fff; }
    .top-nav a.active { color: #38bdf8; border-bottom-color: #38bdf8; }

    .logout-btn { padding: 8px 20px; background: #ef4444; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s; }
    .logout-btn:hover { background: #dc2626; }
    
    .content { flex: 1; background: #f1f5f9; padding: 30px; overflow-y: auto; }
    
    .badge {
      display: inline-flex; justify-content: center; align-items: center;
      background-color: #ef4444; color: white;
      font-size: 0.75rem; font-weight: bold;
      min-width: 20px; height: 20px; padding: 0 6px;
      border-radius: 10px; margin-left: 8px;
    }
  `]
})
export class AdminLayoutComponent {
  count: number | null = null;
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    // Initial fetch
    this.adminService.refreshCount();

    // Subscribe to reactive updates
    this.adminService.totalDestinations$.subscribe({
      next: (c) => {
        this.count = c;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  logout() { this.authService.logout(); }
}
