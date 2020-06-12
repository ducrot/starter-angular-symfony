import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';

import { CoreModule } from '@app/core.module';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidenavComponent } from './layout/components/sidenav/sidenav.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { LanguageComponent } from './layout/components/language/language.component';
import { ThemeComponent } from './layout/components/theme/theme.component';


@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    // Core & Shared
    CoreModule.forRoot(),
    SharedModule,

    // Routing
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    LanguageComponent,
    ThemeComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
