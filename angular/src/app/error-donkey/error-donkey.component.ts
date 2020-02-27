import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TestClient} from "../../lib/api/test-client.service";

@Component({
  selector: 'app-error-donkey',
  templateUrl: './error-donkey.component.html',
  styleUrls: ['./error-donkey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDonkeyComponent {

  constructor(private readonly client: TestClient) {
  }


  badRequest(): void {
    this.client.badRequest().subscribe(
      v => console.log("badRequest", v),
      error => console.error("badRequest", error)
    );
  }


  processingError(): void {
    this.client.processingError().subscribe(
      v => console.log("processingError", v),
      error => console.error("processingError", error)
    );
  }


  unexpectedError(): void {
    this.client.unexpectedError().subscribe(
      v => console.log("unexpectedError", v),
      error => console.error("unexpectedError", error)
    );
  }


}
