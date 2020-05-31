import { Component } from '@angular/core';
import { HeaderService } from '@shared/service/header.service';
import { ConstantsService } from "@app/service/constants.service";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './error-page-layout.component.html',
  styleUrls: ['./error-page-layout.component.scss']
})
export class ErrorPageLayoutComponent {

  appName: string;
  title: string;

  constructor(private constants: ConstantsService, private headerService: HeaderService) {
    this.appName = this.constants.appName;
    this.headerService.getTitle().subscribe(title => {
      this.title = title;
    });
  }

}
