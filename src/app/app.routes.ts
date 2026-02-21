import { Routes } from '@angular/router';
import { AuthenticatedLayoutComponent } from './shared/components/authenticated-layout/authenticated-layout.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage),
  },

  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: 'check-in',
        loadComponent: () =>
          import('./pages/check-in/check-in.page').then(m => m.CheckInPage),
      },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage)
      }
    ]
  },
  


];
