import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from '@modules/admin/admin.routing';
import { UsersPageComponent } from './page/users-page/users-page.component';
import { UserDialogComponent } from './component/user-dialog/user-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { UserManagementServiceClient } from '@pb/app/user-management-service.client';


@NgModule({
  declarations: [
    UsersPageComponent,
    UserDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    MatInputModule
  ],
  providers: [
    UserManagementServiceClient,
  ]
})
export class AdminModule {
}
