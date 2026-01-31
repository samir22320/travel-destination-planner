import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DestinationResponse } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-page">
      <header class="header">
        <div class="brand">TravelPlanner</div>
        <div class="user-controls">
           <button (click)="goToWishlist()" class="wishlist-btn">
             My Wishlist
             <span class="badge" *ngIf="wishlistCount !== null">{{wishlistCount}}</span>
           </button>
           <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </header>

      <div class="hero">
        <h1>Explore Available Destinations</h1>
        <p class="hero-subtitle">Browse all destinations added by administrators</p>
        <div class="search-bar">
          <input [(ngModel)]="searchQuery" placeholder="Search for a destination..." (keyup.enter)="loadDestinations()">
          <button (click)="loadDestinations()">Search</button>
        </div>
      </div>

      <div class="container">
        <!-- Loading State -->
        <div class="loading-state" *ngIf="loading">
          <div class="spinner"></div>
          <p>Loading destinations...</p>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && destinations.length === 0">
          <div class="empty-icon">🌍</div>
          <h2>No Destinations Found</h2>
          <p *ngIf="searchQuery">Try searching for something else or clear your search.</p>
          <p *ngIf="!searchQuery">No destinations have been added yet. Check back later!</p>
          <button *ngIf="searchQuery" (click)="clearSearch()" class="clear-btn">Clear Search</button>
        </div>

        <!-- Destinations Grid -->
        <div class="grid" *ngIf="!loading && destinations.length > 0">
          <div class="card" *ngFor="let dest of destinations">
            <div class="card-img" [style.backgroundImage]="'url(' + dest.flagUrl + ')'"></div>
            <div class="card-content">
              <h2>{{ dest.countryName }}</h2>
              <div class="stats">
                 <span>🏙️ {{ dest.capital }}</span>
                 <span>🌍 {{ dest.region }}</span>
                 <span>👥 {{ dest.population | number }}</span>
                 <span>💰 {{ dest.currencyCode }}</span>
              </div>
              <button class="heart-btn" [class.active]="isInWishlist(dest.id)" (click)="toggleWishlist(dest)">
                {{ isInWishlist(dest.id) ? '♥ In Wishlist' : '♡ Want to Visit' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="!loading && totalPages > 1">
          <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Previous</button>
          <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button [disabled]="currentPage === totalPages - 1" (click)="changePage(currentPage + 1)">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-page { background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .header { background: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .brand { font-weight: 800; font-size: 1.2rem; color: #0f172a; }
    .user-controls button { margin-left: 15px; padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
    .wishlist-btn { background: #fce7f3; color: #db2777; }
    .badge { background: #db2777; color: white; border-radius: 12px; padding: 0 8px; font-size: 0.8rem; font-weight: bold; min-width: 20px; text-align: center; }
    .logout-btn { background: #e2e8f0; color: #475569; }
    
    .hero { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .hero h1 { margin-bottom: 10px; font-size: 2.5rem; }
    .hero-subtitle { margin-bottom: 30px; font-size: 1.1rem; opacity: 0.9; }
    .search-bar { max-width: 600px; margin: 0 auto; display: flex; gap: 10px; }
    .search-bar input { flex: 1; padding: 15px; border-radius: 50px; border: none; font-size: 1rem; outline: none; }
    .search-bar button { padding: 15px 30px; border-radius: 50px; border: none; background: #38bdf8; color: #0f172a; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
    .search-bar button:hover { transform: scale(1.05); }

    .container { max-width: 1200px; margin: 30px auto 50px; padding: 0 20px; }
    
    .loading-state { text-align: center; padding: 60px 20px; }
    .spinner { width: 50px; height: 50px; border: 5px solid #e2e8f0; border-top: 5px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 16px; margin: 20px 0; }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; }
    .empty-state h2 { color: #1e293b; margin-bottom: 10px; }
    .empty-state p { color: #64748b; margin-bottom: 20px; }
    .clear-btn { padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .clear-btn:hover { background: #5568d3; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
    .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); transition: transform 0.3s; }
    .card:hover { transform: translateY(-5px); }
    .card-img { height: 200px; background-size: cover; background-position: center; }
    .card-content { padding: 25px; }
    .card-content h2 { margin-top: 0; color: #1e293b; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem; color: #64748b; margin: 15px 0; }
    .heart-btn { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; font-weight: 600; color: #475569; }
    .heart-btn.active { background: #fce7f3; color: #db2777; border-color: #fce7f3; }
    .heart-btn:hover { background: #f1f5f9; }
    
    .pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 40px; }
    .pagination button { padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class UserDestinationsComponent implements OnInit {
  destinations: DestinationResponse[] = [];
  wishlistIds: Set<number> = new Set();
  wishlistCount: number | null = null;

  searchQuery = '';
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  loading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('📍 User Destinations Component initialized');
    this.loadDestinations();
    this.loadWishlistIds();

    // Initial refresh of count
    setTimeout(() => this.userService.refreshWishlistCount(), 0);

    // Subscribe to reactive wishlist count
    this.userService.wishlistCount$.subscribe({
      next: (count) => {
        console.log('💕 Wishlist count updated:', count);
        this.wishlistCount = count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to get wishlist count', err)
    });
  }

  loadDestinations() {
    console.log('📥 Loading destinations for user...');
    this.loading = true;
    this.userService.getDestinations(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe({
        next: (res) => {
          console.log('✅ Destinations loaded:', res);
          console.log('📊 Response structure:', JSON.stringify(res, null, 2));
          console.log('📦 res.content:', res.content);
          console.log('📈 res.content length:', res.content?.length);
          this.destinations = res.content || [];
          this.totalPages = res.totalPages || 0;
          this.loading = false;
          console.log('🎯 Final destinations array:', this.destinations);
          console.log('🔢 Total destinations:', this.destinations.length);
          console.log('🔄 Forcing change detection...');
          this.cdr.detectChanges(); // Force UI update
          console.log('✅ Change detection completed');
        },
        error: (err) => {
          console.error('❌ Failed to load destinations:', err);
          console.error('❌ Error details:', JSON.stringify(err, null, 2));
          this.loading = false;
          this.cdr.detectChanges(); // Force UI update
        }
      });
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadDestinations();
  }

  loadWishlistIds() {
    console.log('🔄 Loading wishlist IDs...');
    this.userService.getWishlist().subscribe({
      next: (list) => {
        console.log('📥 Raw wishlist response:', list);
        const safeList = Array.isArray(list) ? list : ((list as any).content || []);
        console.log('📋 Wishlist items:', safeList);
        console.log('🔢 Number of wishlist items:', safeList.length);
        this.wishlistIds = new Set(safeList.map((d: any) => d.id));
        console.log('✅ Wishlist IDs loaded:', Array.from(this.wishlistIds));
        console.log('🎯 Total wishlist IDs count:', this.wishlistIds.size);
        this.cdr.detectChanges(); // Force UI update
        console.log('🔄 UI update triggered');
      },
      error: (err) => {
        console.error('❌ Failed to load wishlist IDs:', err);
        console.error('❌ Error details:', JSON.stringify(err, null, 2));
        this.wishlistIds = new Set(); // Ensure it's initialized even on error
        this.cdr.detectChanges();
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadDestinations();
  }

  isInWishlist(id: number): boolean {
    return this.wishlistIds.has(id);
  }

  toggleWishlist(dest: DestinationResponse) {
    if (this.isInWishlist(dest.id)) {
      // Optimistic update: Remove immediately
      this.wishlistIds.delete(dest.id);
      if (this.wishlistCount !== null) {
        this.wishlistCount--; // Decrement count
      }
      this.cdr.detectChanges(); // Force UI update

      this.userService.removeFromWishlist(dest.id).subscribe({
        error: () => {
          this.wishlistIds.add(dest.id); // Revert on error
          if (this.wishlistCount !== null) this.wishlistCount++; // Revert count
          this.cdr.detectChanges();
        }
      });
    } else {
      // Optimistic update: Add immediately
      this.wishlistIds.add(dest.id);
      if (this.wishlistCount !== null) {
        this.wishlistCount++; // Increment count
      }
      this.cdr.detectChanges(); // Force UI update

      this.userService.addToWishlist(dest.id).subscribe({
        error: () => {
          this.wishlistIds.delete(dest.id); // Revert on error
          if (this.wishlistCount !== null) this.wishlistCount--; // Revert count
          this.cdr.detectChanges();
        }
      });
    }
  }

  goToWishlist() { this.router.navigate(['/user/wishlist']); }
  logout() { this.authService.logout(); }
}
