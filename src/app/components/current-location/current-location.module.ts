import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentLocationRoutingModule } from './current-location-routing.module';
import { CurrentLocationComponent } from './current-location/current-location.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [CurrentLocationComponent],
  imports: [
    CommonModule,
    CurrentLocationRoutingModule,
    MatCardModule
  ]
})
export class CurrentLocationModule { }
