import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from '@modules/admin/admin.routing';
import { UsersPageComponent } from './page/users-page/users-page.component';
import { CreateUserDialogComponent } from './component/create-user-dialog/create-user-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { UserManagementServiceClient } from '@pb/app/user-management-service';


@NgModule({
  declarations: [
    UsersPageComponent,
    CreateUserDialogComponent
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
