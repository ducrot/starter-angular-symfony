import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy/privacy.component';
import { LegalComponent } from './legal/legal.component';
import { SharedModule } from '@shared/shared.module';
import { GeneralRoutingModule } from '@modules/general/general.routing';


@NgModule({
  declarations: [
    PrivacyComponent,
    LegalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GeneralRoutingModule
  ]
})
export class GeneralModule {
}
