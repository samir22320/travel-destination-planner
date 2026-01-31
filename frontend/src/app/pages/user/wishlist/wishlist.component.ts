import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { DestinationResponse } from '../../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>My Wishlist</h1>
        <button (click)="goBack()">← Back to Destinations</button>
      </div>

      <div class="empty-state" *ngIf="wishlist.length === 0">
        <p>You haven't added any destinations yet.</p>
      </div>

      <div class="list">
        <div class="item" *ngFor="let dest of wishlist">
           <img [src]="dest.flagUrl" class="thumb">
           <div class="info">
             <h3>{{ dest.countryName }} ({{ dest.capital }})</h3>
             <p>{{ dest.region }} • {{ dest.population | number }} pop.</p>
           </div>
           <button class="remove-btn" (click)="remove(dest.id)">Remove</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 40px auto; padding: 20px; font-family: 'Inter', sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .header button { background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 1rem; }
    .list { display: flex; flex-direction: column; gap: 15px; }
    .item { display: flex; align-items: center; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .thumb { width: 80px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 20px; }
    .info { flex: 1; }
    .info h3 { margin: 0 0 5px 0; font-size: 1.1rem; }
    .info p { margin: 0; color: #64748b; font-size: 0.9rem; }
    .remove-btn { color: #ef4444; background: #fee2e2; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
    .remove-btn:hover { background: #fecaca; }
    .empty-state { text-align: center; color: #94a3b8; margin-top: 50px; font-size: 1.2rem; }
  `]
})
export class WishlistComponent implements OnInit {
  wishlist: DestinationResponse[] = [];
  debugMsg: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.userService.getWishlist().subscribe({
      next: (list) => {
        if (Array.isArray(list)) {
          this.wishlist = list;
        } else {
          this.wishlist = (list as any)?.content || [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('WishlistComponent: Failed to load wishlist', err);
      }
    });
  }

  remove(id: number) {
    this.userService.removeFromWishlist(id).subscribe(() => {
      this.wishlist = this.wishlist.filter(d => d.id !== id);
      this.cdr.detectChanges();
    });
  }

  goBack() {
    this.router.navigate(['/user/destinations']);
  }
}
