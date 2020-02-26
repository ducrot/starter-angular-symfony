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
import {AuthenticationService} from "./auth/authentication.service";
import {AuthenticationClient} from "../api-models/authentication-client.service";
import {HttpClientModule} from "@angular/common/http";
import {TestClient} from "../api-models/test-client.service";


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
  ],
  providers: [
    AuthenticationService,
    AuthenticationClient,
    TestClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
