import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TestServiceClient } from '@pb/app/test-service.client';

@Component({
  selector: 'app-error-donkey',
  templateUrl: './error-donkey.component.html',
  styleUrls: ['./error-donkey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDonkeyComponent {

  readonly errorSubject = new Subject<string | null>();
  readonly error$ = this.errorSubject.asObservable();

  constructor(
    private readonly client: TestServiceClient) {
  }


  async badRequest(): Promise<void> {

    try {
      await this.client.badRequestError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


  async processingError(): Promise<void> {
    try {
      await this.client.processingError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


  async unexpectedError(): Promise<void> {
    try {
      await this.client.unexpectedError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


}
