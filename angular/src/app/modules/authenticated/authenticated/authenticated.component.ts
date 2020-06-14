import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@app/service/auth.service';
import { User } from '@pb/app/user';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent {

  readonly user$: Observable<User>;

  constructor(private readonly authService: AuthService) {
    this.user$ = this.authService.user$;
  }

}
