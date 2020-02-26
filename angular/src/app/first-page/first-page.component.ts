import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SessionService} from "../auth/session.service";
import {Observable} from "rxjs";
import {User} from "../../lib/api/user";


@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstPageComponent {


  readonly user$: Observable<User>;

  constructor(session: SessionService) {
    this.user$ = session.user$;
  }


}
