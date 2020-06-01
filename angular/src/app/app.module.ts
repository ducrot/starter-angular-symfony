import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgModule} from '@angular/core';

import {CoreModule} from '@app/core.module';
import {SharedModule} from '@shared/shared.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {ErrorPageLayoutComponent} from './layout/error-page-layout/error-page-layout.component';


@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    // Core & Shared
    CoreModule.forRoot(),
    SharedModule,

    // App
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ContentLayoutComponent,
    ErrorPageLayoutComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
