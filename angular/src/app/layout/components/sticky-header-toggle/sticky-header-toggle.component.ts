import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/service/theme.service';


@Component({
  selector: 'app-sticky-header-toggle',
  templateUrl: './sticky-header-toggle.component.html',
  styleUrls: ['./sticky-header-toggle.component.scss']
})
export class StickyHeaderToggleComponent implements OnInit {

  @Input() label;
  public isStickyHeader$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
  ) {
  }

  ngOnInit() {
    this.isStickyHeader$ = this.themeService.getStickyHeader();
  }

  toggleStickyHeader(checked: boolean) {
    this.themeService.setStickyHeader(checked);
  }

}
