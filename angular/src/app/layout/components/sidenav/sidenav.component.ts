import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { ConstantsService } from '@app/service/constants.service';
import { ThemeService } from '@app/service/theme.service';
import { Observable } from 'rxjs';
import { I18nService } from '@app/service/i18n.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  public appName: string;
  public currentLang: string;
  public languages: Array<string>;
  public isDarkTheme$: Observable<boolean>;
  public logo: string;

  constructor(
    public authService: AuthService,
    private constants: ConstantsService,
    private i18nService: I18nService,
    private themeService: ThemeService,
  ) {
    this.appName = this.constants.appName;
    this.currentLang = this.i18nService.language;
    this.languages = this.i18nService.supportedLanguages;
  }

  ngOnInit() {
    this.isDarkTheme$ = this.themeService.getDarkTheme();

    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo-negative.svg' : 'assets/logo.svg';
    });
  }

  onLanguageSelect({value: language}): void {
    this.i18nService.language = language;
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  onLogoutClick(event: Event): void {
    this.authService.destroySession();
  }

}
