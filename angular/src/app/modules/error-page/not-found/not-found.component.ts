import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@shared/service/header.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private headerService: HeaderService) {
    this.headerService.setTitle('Not found');
  }

  ngOnInit(): void {
  }

}
