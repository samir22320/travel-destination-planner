import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Sign up to start planning your travels</p>
        
        <form (ngSubmit)="register()" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="credentials.username" name="username" placeholder="Enter your username" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="credentials.password" name="password" placeholder="Enter your password" required>
          </div>

          <div class="form-group">
            <label>Role</label>
            <select [(ngModel)]="credentials.role" name="role" required>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? 
          <a routerLink="/login" class="auth-link">Login here</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .auth-title {
      font-size: 2rem;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 8px;
      text-align: center;
    }

    .auth-subtitle {
      color: #64748b;
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #475569;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      outline: none;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #667eea;
    }

    .btn-submit {
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 10px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #64748b;
    }

    .auth-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      margin-left: 4px;
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
    credentials = {
        username: '',
        password: '',
        role: 'USER'
    };
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    register() {
        if (!this.credentials.username || !this.credentials.password) {
            alert('Please fill in all fields');
            return;
        }

        this.loading = true;
        this.authService.register(this.credentials).subscribe({
            next: (response) => {
                console.log('Registration successful:', response);
                alert('Account created successfully! Please login.');
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error('Registration failed:', error);
                alert('Registration failed. Username might already exist.');
                this.loading = false;
            }
        });
    }
}
