import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TestClient} from '@data/service/test-client.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-error-donkey',
  templateUrl: './error-donkey.component.html',
  styleUrls: ['./error-donkey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDonkeyComponent {

  readonly errorSubject = new Subject<string | null>();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private readonly client: TestClient) {
  }


  badRequest(): void {
    this.client.badRequest().subscribe(
      v => console.log('badRequest', v),
      error => this.errorSubject.next(error.toString())
    );
  }


  processingError(): void {
    this.client.processingError().subscribe(
      v => console.log('processingError', v),
      error => this.errorSubject.next(error.toString())
    );
  }


  unexpectedError(): void {
    this.client.unexpectedError().subscribe(
      v => console.log('unexpectedError', v),
      error => this.errorSubject.next(error.toString())
    );
  }


}
