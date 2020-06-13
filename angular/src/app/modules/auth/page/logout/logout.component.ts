import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '@app/service/auth.service';
import {HeaderService} from '@shared/service/header.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private headerService: HeaderService,
  ) {
    this.headerService.setTitle('Logout');
  }

  ngOnInit(): void {
    // always destroy session when the page is opened
    this.authService.destroySession();
  }

}
