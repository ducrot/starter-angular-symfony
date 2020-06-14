import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@app/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app-layout.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

    // Core
    CoreModule.forRoot(),

    // Routing
    AppRoutingModule,

    // Layout
    AppLayoutModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
