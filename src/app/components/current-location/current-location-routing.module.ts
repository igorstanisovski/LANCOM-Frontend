import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentLocationComponent } from './current-location/current-location.component';

const routes: Routes = [
  {path: '', component: CurrentLocationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentLocationRoutingModule { }
