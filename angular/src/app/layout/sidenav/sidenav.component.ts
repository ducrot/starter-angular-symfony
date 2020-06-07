import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from '@app/service/session.service';
import { ConstantsService } from '@app/service/constants.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  appName: string;

  constructor(
    private readonly session: SessionService,
    private constants: ConstantsService,
  ) {
    this.appName = this.constants.appName;
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

}
