import {Component, Inject} from '@angular/core';
import {Subject} from 'rxjs';
import {TestService} from "@pb/app/test-service";
import {TEST_SERVICE} from "@shared/service-tokens";


interface Draw {
  loading: boolean;
  number: number | null;
  error: any | null;
}


@Component({
  selector: 'app-lucky-number',
  templateUrl: './lucky-number.component.html',
  styleUrls: ['./lucky-number.component.scss']
})
export class LuckyNumberComponent {


  private readonly draw = new Subject<Draw>();
  readonly draw$ = this.draw.asObservable();


  constructor(@Inject(TEST_SERVICE) private readonly testService: TestService) {
  }


  async drawNumber() {
    this.draw.next({
      loading: true,
      error: null,
      number: null
    });
    try {
      const response = await this.testService.luckyNumber({});
      this.draw.next({
        loading: false,
        number: response.number,
        error: null
      });
    } catch (e) {
      this.draw.next({
        loading: false,
        number: null,
        error: e
      });
    }
  }


}
