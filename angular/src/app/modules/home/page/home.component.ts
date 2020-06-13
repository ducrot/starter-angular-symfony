import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@app/service/auth.service';
import { User } from '@pb/app/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  readonly user$: Observable<User>;

  constructor(private readonly authService: AuthService) {
    this.user$ = this.authService.user$;
  }

}
