import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AddDestinationRequest, CountrySuggestionResponse, DestinationResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private baseUrl = 'http://localhost:8080/api/admin/destinations';

    private totalDestinationsSubject = new BehaviorSubject<number | null>(null);
    public totalDestinations$ = this.totalDestinationsSubject.asObservable();

    constructor(private http: HttpClient) { }

    getSuggestions(name: string): Observable<CountrySuggestionResponse[]> {
        return this.http.get<CountrySuggestionResponse[]>(`${this.baseUrl}/suggestions`, {
            params: { name }
        });
    }

    addDestination(request: AddDestinationRequest): Observable<DestinationResponse> {
        return this.http.post<DestinationResponse>(this.baseUrl, request).pipe(
            tap(() => this.refreshCount())
        );
    }

    deleteDestination(countryName: string): Observable<void> {
        return this.http.delete<void>(this.baseUrl, {
            params: { countryName }
        }).pipe(
            tap(() => this.refreshCount())
        );
    }

    // Fetches and Updates State
    refreshCount() {
        const url = `http://localhost:8080/api/admin/destinations/count?t=${new Date().getTime()}`;
        console.log('🔄 Refreshing count from:', url);
        this.http.get<number>(url).subscribe({
            next: (count) => {
                console.log('✅ Count updated to:', count);
                this.totalDestinationsSubject.next(count);
            },
            error: (err) => console.error('❌ Failed to refresh count:', err)
        });
    }

    // Direct API call (kept for backward compatibility or direct usage)
    getTotalDestination(): Observable<number> {
        return this.http.get<number>('http://localhost:8080/api/admin/destinations/count');
    }

    // Assuming a delete endpoint exists, or if not, we can implement it if needed later. 
    // Based on user request, only Add/Remove was mentioned in mandatory.
    // The user provided controller only shows getSuggestions and addDestination.
    // Wait, the user requirements under "Admin Dashboard" said "Admin adds/removes destinations".
    // But the provided controller `AdminDestinationController` ONLY has `getCountrySuggestions` and `addDestination`.
    // I will check if I can delete. The `WantToVisitController` has delete.
    // I will assume for now I can only add, or maybe there is another controller I missed?
    // No, the user pasted code. `AdminDestinationController` is limited.
    // I'll stick to what is provided for now.
}
