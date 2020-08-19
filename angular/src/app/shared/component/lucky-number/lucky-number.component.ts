import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TestServiceClient } from '@pb/app/test-service';


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


  constructor(private readonly client: TestServiceClient) {
  }


  async drawNumber() {
    this.draw.next({
      loading: true,
      error: null,
      number: null
    });
    try {
      const {responseMessage} = await this.client.luckyNumber({});
      this.draw.next({
        loading: false,
        number: responseMessage.number,
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
