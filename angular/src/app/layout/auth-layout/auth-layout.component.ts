import { Component } from '@angular/core';
import { HeaderService } from '@shared/service/header.service';
import { ConstantsService } from "@app/service/constants.service";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {

  appName: string;
  title: string;

  constructor(private constants: ConstantsService, private headerService: HeaderService) {
    this.appName = this.constants.appName;
    this.headerService.getTitle().subscribe(title => {
      this.title = title;
    });
  }

}
