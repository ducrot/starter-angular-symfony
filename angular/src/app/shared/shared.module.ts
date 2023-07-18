import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontawesomeModule } from '@shared/fontawesome.module';
import { MaterialModule } from '@shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationServiceClient } from '@pb/app/authentication-service.client';
import { TestServiceClient } from '@pb/app/test-service.client';
import { AlertComponent } from '@shared/component/alert/alert.component';
import { LuckyNumberComponent } from '@shared/component/lucky-number/lucky-number.component';
import { ErrorDonkeyComponent } from '@shared/component/error-donkey/error-donkey.component';
import { Nl2brPipe } from '@shared/pipe/nl2br.pipe';
import { LogPipe } from '@shared/pipe/log.pipe';
import { LocalizedDatePipe } from '@shared/pipe/localized-date.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    AlertComponent,
    ErrorDonkeyComponent,
    LuckyNumberComponent,
    Nl2brPipe,
    LogPipe,
    LocalizedDatePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontawesomeModule,
    MaterialModule,
    TranslateModule,

    AlertComponent,
    ErrorDonkeyComponent,
    LuckyNumberComponent,
    Nl2brPipe,
    LogPipe,
    LocalizedDatePipe,
  ],
  providers: [
    TestServiceClient,
    AuthenticationServiceClient,
  ]
})
export class SharedModule {
}
