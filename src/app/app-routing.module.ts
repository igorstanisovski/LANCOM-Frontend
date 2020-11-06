import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  { path:'', loadChildren: () => import('src/app/components/home/home.module').then(m => m.HomeModule) },
  { path: 'current-location', loadChildren: () => import('src/app/components/current-location/current-location.module').then(m => m.CurrentLocationModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
