import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@shared/material.module';

import { AlertComponent } from '@shared/component/alert/alert.component';
import {LuckyNumberComponent} from '@shared/component/lucky-number/lucky-number.component';
import {ErrorDonkeyComponent} from '@shared/component/error-donkey/error-donkey.component';

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
  ]
})
export class SharedModule { }
