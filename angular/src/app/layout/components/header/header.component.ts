import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { AuthService } from '@app/service/auth.service';
import { I18nService } from '@app/service/i18n.service';
import { ThemeService } from '@app/service/theme.service';
import { Observable } from 'rxjs';
import { User } from '@pb/app/user';


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
  public stickyHeader$: Observable<boolean>;

  constructor(
    public authService: AuthService,
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

    this.stickyHeader$ = this.themeService.getStickyHeader();
    // this.themeService.getStickyHeader().subscribe(sticky => {
    //   this.stickyHeader = sticky;
    //   console.log(this.stickyHeader);
    // });
  }

  onLogoutClick(event: Event): void {
    this.authService.destroySession();
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

}
