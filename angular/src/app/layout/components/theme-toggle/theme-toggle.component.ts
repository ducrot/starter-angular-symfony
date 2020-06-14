import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/service/theme.service';


@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {

  @Input() label;
  public isDarkTheme$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
  ) {
  }

  ngOnInit() {
    this.isDarkTheme$ = this.themeService.getDarkTheme();
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

}
