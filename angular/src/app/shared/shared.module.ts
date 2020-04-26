import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './component/alert/alert.component';

@NgModule({
  declarations: [AlertComponent],
  exports: [
    AlertComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
