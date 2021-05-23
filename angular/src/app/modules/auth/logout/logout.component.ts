import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { HeaderService } from '@shared/service/header.service';
import { ThemeService } from '@app/service/theme.service';
import { ConstantsService } from '@app/service/constants.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {

  public logo = '';
  public companyName: string;

  constructor(
    private readonly authService: AuthService,
    private headerService: HeaderService,
    private themeService: ThemeService,
    private constants: ConstantsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.headerService.setTitle('Logout');
    this.companyName = this.constants.companyName;
  }

  ngOnInit(): void {
    // always destroy session when the page is opened
    this.authService.destroySession();

    // Select logo for dark/light mode
    this.themeService.getDarkTheme().subscribe(theme => {
      this.logo = (theme) ? 'assets/logo-negative.svg' : 'assets/logo.svg';
      this.cdr.markForCheck();
    });
  }

}
