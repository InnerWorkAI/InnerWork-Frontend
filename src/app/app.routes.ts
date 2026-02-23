import { Routes } from '@angular/router';
import { AuthenticatedLayoutComponent } from './shared/components/authenticated-layout/authenticated-layout.component';
import { userGuard } from './core/guards/user-guard';
import { adminGuard } from './core/guards/admin-guard';

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
        canActivate: [userGuard],
        loadComponent: () => import('./pages/check-in/check-in.page').then(m => m.CheckInPage),
      },
      {
        path: 'dashboard',
        //canActivate: [userGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage)
          }
        ]
      }
    ]
  }

];
