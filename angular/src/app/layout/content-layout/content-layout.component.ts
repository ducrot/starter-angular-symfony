import {Component} from '@angular/core';
import {SessionService} from '@app/service/session.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent {

  constructor(private readonly session: SessionService) {}

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

}
