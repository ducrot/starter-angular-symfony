import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ContentLayoutComponent } from './content-layout/content-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageComponent } from './components/language/language.component';
import { ThemeComponent } from './components/theme/theme.component';


@NgModule({
  declarations: [
    ContentLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    LanguageComponent,
    ThemeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AppLayoutModule { }
