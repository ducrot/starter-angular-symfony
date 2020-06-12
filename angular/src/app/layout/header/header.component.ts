import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { SessionService } from '@app/service/session.service';
import { I18nService } from '@app/service/i18n.service';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/service/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  public appName: string;
  public companyName: string;
  public currentLang: string;
  public languages: Array<string>;
  public isDarkTheme$: Observable<boolean>;
  public logo: string;

  constructor(
    private readonly session: SessionService,
    private constants: ConstantsService,
    private i18nService: I18nService,
    private themeService: ThemeService,
  ) {
    this.appName = this.constants.appName;
    this.companyName = this.constants.companyName;
    this.currentLang = this.i18nService.language;
    this.languages = this.i18nService.supportedLanguages;
  }

  ngOnInit() {
    this.isDarkTheme$ = this.themeService.getDarkTheme();

    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo-negative.svg' : 'assets/logo.svg';
    });
  }

  onLanguageSelect({ value: language }): void {
    this.i18nService.language = language;
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

  public isAuthenticated(): boolean {
    return this.session.isAuthenticated;
  }

}
