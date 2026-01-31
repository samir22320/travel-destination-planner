import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service'; // Adjust path
import { UserService } from '../../../services/user.service';   // Reuse UserService to get list or create Admin specific list logic
import { DestinationResponse, AddDestinationRequest } from '../../../models/models';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
      <h1>Search & Add Destinations</h1>
      <p class="subtitle">Search for countries using the External API and add them to your database.</p>
    </div>

    <div class="search-section">
        <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Search for a country..." class="search-input">
        <button type="button" (click)="search()" class="btn-secondary">Search</button>
    </div>

    <!-- Suggestions List -->
    <div class="suggestions-grid" *ngIf="paginatedSuggestions.length > 0">
        <h3>Search Results ({{suggestions.length}} found)</h3>
        <div class="card-grid">
            <div class="dest-card" *ngFor="let suggestion of paginatedSuggestions">
                <img [src]="suggestion.flagUrl" alt="Flag" class="flag-img">
                <div class="details">
                    <h3>{{suggestion.countryName}} ({{suggestion.countryCode}})</h3>
                    <p><strong>Capital:</strong> {{suggestion.capital}}</p>
                    <p><strong>Region:</strong> {{suggestion.region}}</p>
                    <p><strong>Population:</strong> {{suggestion.population | number}}</p>
                    <p><strong>Currency:</strong> {{suggestion.currencyName}} ({{suggestion.currencyCode}})</p>
                    <button class="btn-add" (click)="addFromSuggestion(suggestion)">Add to Database</button>
                </div>
            </div>
        </div>
        <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="previousPage()" [disabled]="currentPage === 0" class="btn-small">Previous</button>
            <span>Page {{currentPage + 1}} of {{totalPages}}</span>
            <button (click)="nextPage()" [disabled]="currentPage === totalPages - 1" class="btn-small">Next</button>
        </div>
    </div>

    <div class="no-results" *ngIf="searchPerformed && suggestions.length === 0 && !loading">
        <p>No results found for "{{searchTerm}}".</p>
    </div>

    <!-- Add Modal -->
    <div class="modal" *ngIf="showAddModal">
      <div class="modal-content">
        <h2>Add Destination Manually</h2>
        <form (ngSubmit)="addDestination()">
          <input [(ngModel)]="newDest.countryName" name="country" placeholder="Country" required>
          <input [(ngModel)]="newDest.capital" name="capital" placeholder="Capital" required>
          <input [(ngModel)]="newDest.region" name="region" placeholder="Region" required>
          <input [(ngModel)]="newDest.population" name="population" type="number" placeholder="Population" required>
          <input [(ngModel)]="newDest.currencyCode" name="currCode" placeholder="Currency Code (e.g. USD)" required>
          <input [(ngModel)]="newDest.currencyName" name="currName" placeholder="Currency Name" required>
          <input [(ngModel)]="newDest.flagUrl" name="flag" placeholder="Flag URL" required>
          <input [(ngModel)]="newDest.countryCode" name="code" placeholder="Country Code (e.g. US)" required>
          
          <div class="modal-actions">
             <button type="button" (click)="showAddModal = false">Cancel</button>
             <button type="submit" [disabled]="loading">Save</button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { margin-bottom: 5px; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 1rem; margin-bottom: 0; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: background 0.3s; outline: none; }
    .btn-secondary:hover { background: #475569; }
    .btn-secondary:focus { background: #334155; box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.3); }
    .btn-small { background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; transition: background 0.3s; }
    .btn-small:hover { background: #059669; }
    .btn-add { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px; width: 100%; transition: background 0.3s; }
    .btn-add:hover { background: #059669; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;}
    .dest-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .flag-img { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; margin-bottom: 10px; }
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
    .modal-content { background: white; padding: 30px; border-radius: 8px; width: 400px; }
    .modal-content input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .modal-actions button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
    .modal-actions button:hover { opacity: 0.9; }
    .search-section { margin-bottom: 20px; display: flex; gap: 10px; }
    .search-input { flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; outline: none; }
    .search-input:focus { border-color: #3b82f6; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    .no-results { text-align: center; padding: 40px; color: #64748b; background: white; border-radius: 8px; margin-top: 20px; }
  `]
})
export class AdminDashboardComponent {
    suggestions: any[] = [];
    paginatedSuggestions: any[] = [];
    searchTerm: string = '';
    showAddModal = false;
    loading = false;
    searchPerformed = false; // Track if search was actually performed

    // Pagination
    currentPage = 0;
    pageSize = 10;
    totalPages = 0;

    newDest: AddDestinationRequest = {
        countryName: '', capital: '', region: '', population: 0,
        currencyCode: '', currencyName: '', flagUrl: '', countryCode: ''
    };

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    search() {
        console.log('🔍 Search called with term:', this.searchTerm);
        if (!this.searchTerm.trim()) {
            console.warn('⚠️ Search term is empty');
            this.searchPerformed = false;
            return;
        }
        this.loading = true;
        this.searchPerformed = true; // Mark that search was performed
        console.log('📤 Calling AdminService.getSuggestions...');
        this.adminService.getSuggestions(this.searchTerm).subscribe({
            next: (res) => {
                console.log('✅ Search results received:', res);
                this.suggestions = res;
                this.currentPage = 0;
                this.updatePagination();
                this.loading = false;
                console.log('📊 Paginated suggestions:', this.paginatedSuggestions);
                this.cdr.detectChanges(); // Safe - after data arrives
            },
            error: (err) => {
                console.error('❌ Search failed with error:', err);
                alert('Search failed. Check console for details.');
                this.loading = false;
                this.cdr.detectChanges(); // Safe - in error callback
            }
        });
    }

    addFromSuggestion(suggestion: any) {
        const request: AddDestinationRequest = {
            countryName: suggestion.countryName,
            capital: suggestion.capital,
            region: suggestion.region,
            population: suggestion.population,
            currencyCode: suggestion.currencyCode,
            currencyName: suggestion.currencyName,
            flagUrl: suggestion.flagUrl,
            countryCode: suggestion.countryCode
        };

        this.loading = true;
        this.adminService.addDestination(request).subscribe({
            next: () => {
                this.loading = false;
                this.adminService.refreshCount(); // Force refresh to update nav badge
                alert(`${suggestion.countryName} added successfully! You can find it in the 'Manage Database' page.`);
            },
            error: (err) => {
                this.loading = false;
                alert('Failed to add destination. It may already exist.');
                console.error('Add failed', err);
            }
        });
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.suggestions.length / this.pageSize);
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedSuggestions = this.suggestions.slice(start, end);
        this.cdr.detectChanges(); // Force UI update
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    addDestination() {
        this.loading = true;
        this.adminService.addDestination(this.newDest).subscribe({
            next: () => {
                this.loading = false;
                this.showAddModal = false;
                this.newDest = { countryName: '', capital: '', region: '', population: 0, currencyCode: '', currencyName: '', flagUrl: '', countryCode: '' };
                this.adminService.refreshCount(); // Force refresh
                alert('Destination added successfully!');
            },
            error: () => {
                this.loading = false;
                alert('Failed to add destination.');
            }
        });
    }
}
