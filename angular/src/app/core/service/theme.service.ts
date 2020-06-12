import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logger } from '@app/service/logger.service';

const themeKey = 'isDarkTheme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme: BehaviorSubject<boolean>;

  constructor() {
    this.isDarkTheme = new BehaviorSubject<boolean>(
      localStorage.getItem(themeKey) === 'true'
    );
  }

  setDarkTheme(isDarkTheme: boolean) {
    this.isDarkTheme.next(isDarkTheme);
    localStorage.setItem(themeKey, this.isDarkTheme.value.toString());
  }

  getDarkTheme(): Observable<boolean> {
    return this.isDarkTheme;
  }
}
