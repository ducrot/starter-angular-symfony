import { Component } from '@angular/core';
import { HeaderService } from '@shared/service/header.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {

  title: string;

  constructor(private headerService: HeaderService) {
    this.headerService.getTitle().subscribe(title => {
      this.title = title;
    });
  }

}
