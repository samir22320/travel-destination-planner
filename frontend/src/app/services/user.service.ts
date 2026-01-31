import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { DestinationResponse, Page } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private destinationsUrl = 'http://localhost:8080/api/user/destinations';
    private wishlistUrl = 'http://localhost:8080/api/user/want-to-visit';

    constructor(private http: HttpClient) { }

    getDestinations(page: number, size: number, search?: string): Observable<Page<DestinationResponse>> {
        let params: any = { page, size };
        if (search) {
            params.search = search;
        }
        return this.http.get<Page<DestinationResponse>>(this.destinationsUrl, { params });
    }

    addToWishlist(destinationId: number): Observable<void> {
        return this.http.post<void>(`${this.wishlistUrl}/${destinationId}`, {}).pipe(
            tap(() => this.refreshWishlistCount())
        );
    }

    removeFromWishlist(destinationId: number): Observable<void> {
        return this.http.delete<void>(`${this.wishlistUrl}/${destinationId}`).pipe(
            tap(() => this.refreshWishlistCount())
        );
    }

    getWishlist(): Observable<DestinationResponse[]> {
        return this.http.get<DestinationResponse[]>(this.wishlistUrl);
    }

    // Reactive Wishlist Count
    private wishlistCountSubject = new BehaviorSubject<number | null>(null);
    public wishlistCount$ = this.wishlistCountSubject.asObservable();

    refreshWishlistCount() {
        // user requested this specific API for the count
        const url = `http://localhost:8080/api/user/destinations/count?t=${new Date().getTime()}`;
        this.http.get<number>(url).subscribe({
            next: (count) => this.wishlistCountSubject.next(count),
            error: (err) => console.error('Failed to refresh wishlist count', err)
        });
    }
}
