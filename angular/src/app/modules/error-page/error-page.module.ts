import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NotFoundComponent } from '@modules/error-page/not-found/not-found.component';
import { ErrorPageRoutingModule } from '@modules/error-page/error-page.routing';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ErrorPageRoutingModule
  ]
})
export class ErrorPageModule {
}
