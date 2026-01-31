import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    console.log('LoginComponent: login() called');
    if (this.loading) {
      console.log('LoginComponent: Already loading, ignoring click.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const body = {
      username: this.username,
      password: this.password
    };

    console.log('LoginComponent: Sending request to authService.login', body);

    this.authService.login(body)
      .subscribe({
        next: (res) => {
          console.log('LoginComponent: Login SUCCESS', res);
          console.log('LoginComponent: Role is Admin?', this.authService.isAdmin());
          console.log('LoginComponent: Role is User?', this.authService.isUser());

          this.loading = false;
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user']);
          } else {
            console.warn('LoginComponent: Role unknown, defaulting to user');
            this.router.navigate(['/user']);
          }
        },
        error: (err) => {
          console.error('LoginComponent: Login FAILED', err);
          this.loading = false;
          this.errorMessage = 'Invalid username or password';
        },
        complete: () => {
          console.log('LoginComponent: Observable completed');
          this.loading = false;
        }
      });
  }
}
