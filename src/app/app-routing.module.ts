import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { HomeComponent } from './pages/home/home.component';
import { ShowComponent } from './pages/show/show.component';

const routes: Routes = [
  { component: HomeComponent, path: 'home' },
  { component: ShowComponent, path: 'show' },
  { component: FavouritesComponent, path: 'favourites' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
