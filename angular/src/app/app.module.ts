import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';

import { CoreModule } from '@app/core.module';
import { DataModule } from '@data/data.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {FirstPageComponent} from './first-page/first-page.component';
import {SecondPageComponent} from './second-page/second-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LuckyNumberComponent} from './lucky-number/lucky-number.component';
import {ErrorDonkeyComponent} from './error-donkey/error-donkey.component';

import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';



@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    // Core, Data & Shared
    CoreModule,
    DataModule,
    SharedModule,

    // App
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    FirstPageComponent,
    SecondPageComponent,
    NotFoundPageComponent,
    HomePageComponent,
    LuckyNumberComponent,
    ErrorDonkeyComponent,

    AuthLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
