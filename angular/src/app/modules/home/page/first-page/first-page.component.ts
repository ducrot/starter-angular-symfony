import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '@app/service/auth.service';
import {Observable} from 'rxjs';
import {User} from "@pb/app/user";


@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstPageComponent {

  readonly user$: Observable<User>;

  constructor(private readonly authService: AuthService) {
    this.user$ = this.authService.user$;
  }

}
