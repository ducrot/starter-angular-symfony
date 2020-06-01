import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Subject} from 'rxjs';
import {TEST_SERVICE} from "@shared/service-tokens";
import {TestService} from "@pb/app/test-service";

@Component({
  selector: 'app-error-donkey',
  templateUrl: './error-donkey.component.html',
  styleUrls: ['./error-donkey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDonkeyComponent {

  readonly errorSubject = new Subject<string | null>();
  readonly error$ = this.errorSubject.asObservable();

  constructor(@Inject(TEST_SERVICE) private readonly testService: TestService) {
  }


  async badRequest(): Promise<void> {
    try {
      await this.testService.badRequestError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


  async processingError(): Promise<void> {
    try {
      await this.testService.processingError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


  async unexpectedError(): Promise<void> {
    try {
      await this.testService.unexpectedError({});
    } catch (e) {
      this.errorSubject.next(e.toString());
    }
  }


}
