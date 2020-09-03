import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '@shared/service/alert.service';
import { TranslateService } from '@ngx-translate/core';

interface AlertMessageInterface {
  cssClass: string;
  type: string;
  text: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  message: AlertMessageInterface;

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        if (message) {
          // Set CSS class based on message.type
          switch (message.type) {
            case 'success':
              message.cssClass = 'alert alert-success';
              break;
            case 'warning':
              message.cssClass = 'alert alert-warning';
              break;
            case 'info':
              message.cssClass = 'alert alert-info';
              break;
            case 'error':
              message.cssClass = 'alert alert-danger';
              break;
          }
        }
        this.message = message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
