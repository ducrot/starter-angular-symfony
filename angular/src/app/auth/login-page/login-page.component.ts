import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticationClient} from "../../../api-models/authentication-client.service";
import {TestClient} from "../../../api-models/test-client.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  constructor(
    private readonly authClient: AuthenticationClient,
    private readonly testClient: TestClient
  ) {

  }


  login() {

    this.authClient.login({
      username: 'max',
      password: 'muster'
    }).subscribe(
      val => {
        console.log(val);

        this.testClient.luckyNumber().subscribe(v => console.log(v))

      },
      error => console.error(error)
    );

  }

}
