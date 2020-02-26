import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FirstPageComponent} from './first-page/first-page.component';
import {SecondPageComponent} from './second-page/second-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {LogoutPageComponent} from './auth/logout-page/logout-page.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationInterceptor} from "./auth/authentication.interceptor";
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LuckyNumberComponent } from './lucky-number/lucky-number.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSliderModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  declarations: [
    AppComponent,
    FirstPageComponent,
    SecondPageComponent,
    LogoutPageComponent,
    LoginPageComponent,
    NotFoundPageComponent,
    HomePageComponent,
    LuckyNumberComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
