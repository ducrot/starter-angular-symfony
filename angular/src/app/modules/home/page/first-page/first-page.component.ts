import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SessionService} from '@app/service/session.service';
import {Observable} from 'rxjs';
import {User} from '@data/schema/user';


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
