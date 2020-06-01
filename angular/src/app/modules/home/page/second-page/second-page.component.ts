import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {SessionService} from '@app/service/session.service';
import {User} from "@pb/app/user";

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondPageComponent {

  readonly user$: Observable<User>;

  constructor(session: SessionService) {
    this.user$ = session.user$;
  }

}
