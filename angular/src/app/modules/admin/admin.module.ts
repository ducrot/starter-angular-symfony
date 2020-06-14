import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from '@modules/admin/admin.routing';
import { UsersPageComponent } from './page/users-page/users-page.component';
import { ProtobufRpcHandler } from '@app/service/protobuf-rpc-handler.service';
import { USER_MAN_SERVICE } from '@modules/admin/service-tokens';
import { UserManagementServiceClientImpl } from '@pb/app/user-management-service';
import { CreateUserDialogComponent } from './component/create-user-dialog/create-user-dialog.component';
import { MatInputModule } from '@angular/material/input';


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
    {
      provide: USER_MAN_SERVICE, deps: [ProtobufRpcHandler],
      useFactory: (rpc: ProtobufRpcHandler) => new UserManagementServiceClientImpl(rpc)
    },
  ]
})
export class AdminModule {
}
