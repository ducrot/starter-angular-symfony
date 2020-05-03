import {NgModule} from '@angular/core';
import {HomeComponent} from '@modules/home/page/home.component';
import {FirstPageComponent} from '@modules/home/page/first-page/first-page.component';
import {SecondPageComponent} from '@modules/home/page/second-page/second-page.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {HomeRoutingModule} from '@modules/home/home.routing';


@NgModule({
    declarations: [
      HomeComponent,
      FirstPageComponent,
      SecondPageComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      HomeRoutingModule
    ],
})
export class HomeModule {}
