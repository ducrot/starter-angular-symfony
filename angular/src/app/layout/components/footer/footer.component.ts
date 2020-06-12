import { Component } from '@angular/core';
import { ConstantsService } from '@app/service/constants.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  appName: string;
  companyName: string;
  currentYear: number = new Date().getFullYear();

  navItems = [
    { link: '/', title: 'Home' },
    { link: '/general/legal', title: 'Corporate Information' },
    { link: '/general/privacy', title: 'Privacy Notice' }
  ];

  constructor(private constants: ConstantsService) {
    this.appName = this.constants.appName;
    this.companyName = this.constants.companyName;
  }

}