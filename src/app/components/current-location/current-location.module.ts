import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentLocationRoutingModule } from './current-location-routing.module';
import { CurrentLocationComponent } from './current-location/current-location.component';


@NgModule({
  declarations: [CurrentLocationComponent],
  imports: [
    CommonModule,
    CurrentLocationRoutingModule
  ]
})
export class CurrentLocationModule { }
