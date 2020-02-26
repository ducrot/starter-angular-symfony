import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SessionService} from "../auth/session.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

  constructor(private readonly session: SessionService) {
  }

  onLogoutClick(event:Event): void {
    this.session.destroySession();
  }

}
