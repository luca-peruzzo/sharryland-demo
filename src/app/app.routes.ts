import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




export const routes: Routes = [
  { loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), path: 'home' },
  { loadComponent: () => import('./pages/show/show.component').then(m => m.ShowComponent), path: 'show' },
  { loadComponent: () => import('./pages/favourites/favourites.component').then(m => m.FavouritesComponent), path: 'favourites' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
