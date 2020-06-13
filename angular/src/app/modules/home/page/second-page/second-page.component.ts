import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '@app/service/auth.service';
import {User} from "@pb/app/user";

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondPageComponent {

  readonly user$: Observable<User>;

  constructor(private readonly authService: AuthService) {
    this.user$ = this.authService.user$;
  }

}
