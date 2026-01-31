import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsService } from '../../services/destinations.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent implements OnInit {

  destinations: any[] = [];
  loading = true;

  constructor(private service: DestinationsService) {}

  ngOnInit(): void {
    this.service.getDestinations().subscribe({
      next: (res) => {
        console.log('DESTINATIONS RESPONSE FULL:', res);

        if (res && res.content) {
          this.destinations = res.content;
        } else {
          this.destinations = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('DESTINATIONS ERROR', err);
        this.loading = false;
      }
    });
  }
}
