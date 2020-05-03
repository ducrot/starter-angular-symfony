import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {TestClient} from '@data/service/test-client.service';


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


  constructor(private readonly testClient: TestClient) {
  }


  drawNumber() {
    this.draw.next({
      loading: true,
      error: null,
      number: null
    });
    this.testClient
      .luckyNumber()
      .subscribe(
        value => this.draw.next({loading: false, number: value, error: null}),
        error => this.draw.next({loading: false, number: null, error})
      );
  }


}
