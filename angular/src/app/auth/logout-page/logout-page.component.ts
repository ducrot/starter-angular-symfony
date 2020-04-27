import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SessionService} from "@app/service/session.service";

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutPageComponent implements OnInit {

  constructor(
    private readonly session: SessionService,
  ) {
  }

  ngOnInit(): void {
    // always destroy session when the page is opened
    this.session.destroySession();
  }

}
