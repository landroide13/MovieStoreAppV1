import { Routes } from '@angular/router';

import { AuthComponent } from './features/auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },

  { path: 'movies', 
    loadComponent: () => import('../app/features/movie/movie.component').then(c => c.MovieComponent)
  },

  { path: 'movie/:id', 
    loadComponent: () => import('../app/features/movie/movie-details/movie-detail.component').then(c => c.MovieDetailComponent)
  },

  {
    path: 'edit/:id',
    loadComponent: () => import('../app/features/movie-form/movie-form.component').then(c => c.MovieFormComponent)
  }


];
