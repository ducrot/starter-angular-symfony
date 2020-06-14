import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ContentLayoutComponent } from './content-layout/content-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageComponent } from './components/language/language.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { StickyHeaderToggleComponent } from './components/sticky-header-toggle/sticky-header-toggle.component';


@NgModule({
  declarations: [
    ContentLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    LanguageComponent,
    ThemeToggleComponent,
    StickyHeaderToggleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AppLayoutModule { }
