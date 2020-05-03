import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '@data/schema/user';
import {SessionService} from '@app/service/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  readonly user$: Observable<User>;

  constructor(session: SessionService) {
    this.user$ = session.user$;
  }
}
