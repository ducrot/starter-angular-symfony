import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Logger } from '@app/service/logger.service';
import { environment } from '@env';
import { ThemeService } from '@app/service/theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public theme = 'app-light-theme';

  constructor(
    private themeService: ThemeService,
    private overlayContainer: OverlayContainer,
  ) {
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup theme
    this.themeService.getDarkTheme().subscribe(theme => {
      this.theme = (theme) ? 'app-dark-theme' : 'app-light-theme';

      if (this.overlayContainer) {
        const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
        const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
        if (themeClassesToRemove.length) {
          overlayContainerClasses.remove(...themeClassesToRemove);
        }
        overlayContainerClasses.add(this.theme);
      }

      log.debug(`Theme switched to ${this.theme}`);
    });
  }

}
