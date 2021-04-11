import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

import { AuthRoutingModule } from './auth.routing';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule {
}
