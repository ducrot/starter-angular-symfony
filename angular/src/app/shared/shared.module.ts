import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@shared/material.module';

import {AlertComponent} from '@shared/component/alert/alert.component';
import {LuckyNumberComponent} from '@shared/component/lucky-number/lucky-number.component';
import {ErrorDonkeyComponent} from '@shared/component/error-donkey/error-donkey.component';
import {TestServiceClientImpl} from "@pb/app/test-service";
import {ProtobufRpcHandler} from "@app/service/protobuf-rpc-handler.service";
import {AuthenticationServiceClientImpl} from "@pb/app/authentication-service";
import {AUTH_SERVICE, TEST_SERVICE} from "@shared/service-tokens";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    AlertComponent,
    ErrorDonkeyComponent,
    LuckyNumberComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MaterialModule,

    AlertComponent,
    ErrorDonkeyComponent,
    LuckyNumberComponent
  ],
  providers: [
    {
      provide: TEST_SERVICE, deps: [ProtobufRpcHandler],
      useFactory: (rpc: ProtobufRpcHandler) => new TestServiceClientImpl(rpc)
    },
    {
      provide: AUTH_SERVICE, deps: [ProtobufRpcHandler],
      useFactory: (rpc: ProtobufRpcHandler) => new AuthenticationServiceClientImpl(rpc)

    },
  ]
})
export class SharedModule {
}
