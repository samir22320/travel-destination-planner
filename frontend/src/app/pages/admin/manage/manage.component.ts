import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AdminService } from '../../../services/admin.service';
import { DestinationResponse } from '../../../models/models';

@Component({
    selector: 'app-manage-destinations',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="manage-page">
        <h2 class="section-title">📍 Manage Database <span class="count-badge" *ngIf="totalDestinations !== null">({{totalDestinations}})</span></h2>
        <p class="subtitle">View and delete destinations currently in the database.</p>

        <div class="loading-overlay" *ngIf="loading">
            <div class="spinner"></div>
        </div>

        <div class="card-grid" *ngIf="destinations.length > 0; else noData">
            <div class="dest-card" *ngFor="let dest of destinations">
                <img [src]="dest.flagUrl" alt="Flag" class="flag-img">
                <div class="details">
                    <h3>{{dest.countryName}} ({{dest.countryCode}})</h3>
                    <p><strong>Capital:</strong> {{dest.capital}}</p>
                    <p><strong>Region:</strong> {{dest.region}}</p>
                    <p><strong>Population:</strong> {{dest.population | number}}</p>
                    <p><strong>Currency:</strong> {{dest.currencyName}} ({{dest.currencyCode}})</p>
                    <button class="btn-delete" (click)="deleteDestination(dest.countryName)">Delete</button>
                </div>
            </div>
        </div>

        <ng-template #noData>
            <div class="no-data" *ngIf="!loading">
                <p>No destinations found in the database.</p>
            </div>
        </ng-template>
    </div>
  `,
    styles: [`
    .manage-page { padding: 10px; }
    .section-title { color: #0f172a; font-size: 1.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 10px; }
    .count-badge { font-size: 1.2rem; background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-weight: normal; }
    .subtitle { color: #64748b; margin-bottom: 2rem; }
    
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .dest-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .dest-card:hover { transform: translateY(-4px); }
    
    .flag-img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; border: 1px solid #f1f5f9; }
    .details h3 { margin: 0 0 10px 0; color: #1e293b; }
    .details p { margin: 5px 0; font-size: 0.9rem; color: #475569; }
    
    .btn-delete { width: 100%; margin-top: 15px; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s; }
    .btn-delete:hover { background: #dc2626; }
    
    .loading-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .no-data { text-align: center; padding: 50px; background: white; border-radius: 12px; color: #64748b; }
  `]
})
export class ManageDestinationsComponent {
    destinations: DestinationResponse[] = [];
    loading = false;
    totalDestinations: number | null = null;

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) {
        console.log('📍 ManageDestinationsComponent initialized');

        // Subscribe to reactive count ONCE
        this.adminService.totalDestinations$.subscribe({
            next: (count) => {
                this.totalDestinations = count;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Failed to get total count', err)
        });

        // Call loadDestinations after a short delay to ensure component is fully initialized
        setTimeout(() => this.loadDestinations(), 0);
    }

    loadDestinations() {
        console.log('📥 Loading destinations from API...');
        this.loading = true;

        // Ensure count is fresh
        this.adminService.refreshCount();

        this.userService.getDestinations(0, 100).subscribe({
            next: (res) => {
                console.log('✅ Destinations loaded:', res);
                this.destinations = res.content;
                this.loading = false;
                console.log('📊 Total destinations:', this.destinations.length);
                this.cdr.detectChanges(); // Safe to call here after data arrives
            },
            error: (err) => {
                console.error('❌ Failed to load destinations:', err);
                alert('Failed to load destinations. Check console for details.');
                this.loading = false;
                this.cdr.detectChanges(); // Safe to call in error callback
            }
        });
    }

    deleteDestination(countryName: string) {
        if (!confirm(`Are you sure you want to delete ${countryName}?`)) {
            return;
        }

        this.loading = true;
        this.adminService.deleteDestination(countryName).subscribe({
            next: () => {
                alert(`${countryName} deleted successfully!`);
                this.loadDestinations();
            },
            error: (err) => {
                this.loading = false;
                alert('Failed to delete destination.');
                console.error('Delete failed', err);
                this.cdr.detectChanges();
            }
        });
    }
}
