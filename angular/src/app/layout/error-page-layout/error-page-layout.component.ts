import { Component } from '@angular/core';
import { HeaderService } from '@shared/service/header.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './error-page-layout.component.html',
  styleUrls: ['./error-page-layout.component.scss']
})
export class ErrorPageLayoutComponent {

  title: string;

  constructor(private headerService: HeaderService) {
    this.headerService.getTitle().subscribe(title => {
      this.title = title;
    });
  }

}
