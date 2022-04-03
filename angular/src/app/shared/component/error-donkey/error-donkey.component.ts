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
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorSubject.next(error.toString());
      }
    }
  }


  async processingError(): Promise<void> {
    try {
      await this.client.processingError({});
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorSubject.next(error.toString());
      }
    }
  }


  async unexpectedError(): Promise<void> {
    try {
      await this.client.unexpectedError({});
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorSubject.next(error.toString());
      }
    }
  }


}
