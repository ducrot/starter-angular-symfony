import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { SessionService } from '@app/service/session.service';
import { I18nService } from '@app/service/i18n.service';
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
  public logo: string;

  constructor(
    private readonly session: SessionService,
    private constants: ConstantsService,
    private i18nService: I18nService,
    private themeService: ThemeService,
  ) {
    this.appName = this.constants.appName;
    this.companyName = this.constants.companyName;
  }

  ngOnInit() {
    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo-negative.svg' : 'assets/logo.svg';
    });
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

  public isAuthenticated(): boolean {
    return this.session.isAuthenticated;
  }

}
