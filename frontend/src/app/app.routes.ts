import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, adminGuard, userGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'manage',
        loadComponent: () => import('./pages/admin/manage/manage.component').then(m => m.ManageDestinationsComponent)
      },
      {
        path: 'suggestions',
        loadComponent: () => import('./pages/admin/suggestions/suggestions.component').then(m => m.SuggestionsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'user',
    canActivate: [authGuard, userGuard],
    children: [
      {
        path: 'destinations',
        loadComponent: () => import('./pages/user/user-destinations/user-destinations.component').then(m => m.UserDestinationsComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/user/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      { path: '', redirectTo: 'destinations', pathMatch: 'full' }
    ]
  },
  {
    path: 'destinations', // Legacy/Default redirect based on role? Or just login
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
