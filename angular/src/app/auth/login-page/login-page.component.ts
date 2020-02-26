import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticationClient} from "../../../api-models/authentication-client.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent  {

  constructor(private readonly authClient:AuthenticationClient) {

  }


  login() {

    this.authClient.login({
      username: 'max',
      password: 'muster'
    }).subscribe(
      val => console.log(val),
      error => console.error(error)
    );

  }

}
