import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { AuthenticatedComponent } from './authenticated/authenticated.component';


@NgModule({
  declarations: [AuthenticatedComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticatedRoutingModule
  ]
})
export class AuthenticatedModule {
}
