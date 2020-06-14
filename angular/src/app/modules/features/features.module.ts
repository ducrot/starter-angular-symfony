import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComponent } from './features/features.component';


@NgModule({
  declarations: [FeaturesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
