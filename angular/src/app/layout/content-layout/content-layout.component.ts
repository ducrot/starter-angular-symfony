import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/service/theme.service';
import { AuthService } from '@app/service/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  public stickyHeader$!: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    public readonly authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.stickyHeader$ = this.themeService.getStickyHeader();
  }

}
