import {Component} from '@angular/core';
import {SessionService} from '@app/service/session.service';
import {ConstantsService} from "@app/service/constants.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent {

  appName: string;

  constructor(private readonly constants: ConstantsService, private readonly session: SessionService) {
    this.appName = this.constants.appName;
  }

  onLogoutClick(event: Event): void {
    this.session.destroySession();
  }

}
