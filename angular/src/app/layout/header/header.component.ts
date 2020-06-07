import { Component, EventEmitter, Output } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';
import { SessionService } from '@app/service/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  appName: string;
  companyName: string;

  constructor(
    private readonly session: SessionService,
    private constants: ConstantsService,
  ) {
    this.appName = this.constants.appName;
    this.companyName = this.constants.companyName;
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

  public isAuthenticated(): boolean {
    return this.session.isAuthenticated;
  }

}
