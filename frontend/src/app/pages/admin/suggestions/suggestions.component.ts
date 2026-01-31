import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CountrySuggestionResponse, AddDestinationRequest } from '../../../models/models';

@Component({
    selector: 'app-suggestions',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container">
      <h1>Destination Suggestions</h1>
      <div class="search-box">
        <input [(ngModel)]="searchQuery" placeholder="Search country (e.g. France)..." (keyup.enter)="search()">
        <button (click)="search()">Search</button>
      </div>

      <div class="results" *ngIf="suggestions.length > 0">
        <div class="suggestion-card" *ngFor="let country of suggestions">
           <div class="card-header">
             <img [src]="country.flags.png" class="flag">
             <h3>{{ country.name }}</h3>
           </div>
           <div class="card-body">
             <p><strong>Capital:</strong> {{ country.capital }}</p>
             <p><strong>Region:</strong> {{ country.region }}</p>
             <p><strong>Population:</strong> {{ country.population | number }}</p>
           </div>
           <button class="add-btn" (click)="addToDb(country)">+ Add to Destinations</button>
        </div>
      </div>
      <p *ngIf="hasSearched && suggestions.length === 0">No results found.</p>
    </div>
  `,
    styles: [`
    .container { padding: 20px; }
    .search-box { display: flex; gap: 10px; margin-bottom: 30px; }
    .search-box input { flex: 1; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; }
    .search-box button { padding: 12px 24px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .results { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .suggestion-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; }
    .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
    .flag { width: 40px; height: 30px; object-fit: cover; border-radius: 4px; }
    .card-body { flex: 1; font-size: 0.9rem; color: #475569; margin-bottom: 15px; }
    .add-btn { width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
    .add-btn:hover { background: #059669; }
  `]
})
export class SuggestionsComponent {
    searchQuery = '';
    suggestions: CountrySuggestionResponse[] = [];
    hasSearched = false;

    constructor(private adminService: AdminService) { }

    search() {
        if (!this.searchQuery) return;
        this.adminService.getSuggestions(this.searchQuery).subscribe(res => {
            this.suggestions = res;
            this.hasSearched = true;
        });
    }

    addToDb(country: CountrySuggestionResponse) {
        // Extract first currency
        const currKey = Object.keys(country.currencies)[0];
        const currency = country.currencies[currKey];

        const req: AddDestinationRequest = {
            countryName: country.name,
            capital: country.capital,
            region: country.region,
            population: country.population,
            currencyCode: currKey,
            currencyName: currency.name,
            flagUrl: country.flags.png,
            countryCode: country.cca2
        };

        this.adminService.addDestination(req).subscribe({
            next: () => alert(`Added ${country.name} to destinations!`),
            error: (err) => alert('Failed to add destination')
        });
    }
}
