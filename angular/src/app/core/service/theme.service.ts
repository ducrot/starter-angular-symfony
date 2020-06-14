import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logger } from '@app/service/logger.service';

const themeKey = 'isDarkTheme';
const stickyKey = 'isStickyHeader';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkTheme: BehaviorSubject<boolean>;
  private isStickyHeader: BehaviorSubject<boolean>;

  constructor() {
    this.isDarkTheme = new BehaviorSubject<boolean>(
      localStorage.getItem(themeKey) === 'true'
    );
    this.isStickyHeader = new BehaviorSubject<boolean>(
      (localStorage.getItem(stickyKey) === null || localStorage.getItem(stickyKey) === 'true')
    );
  }

  setDarkTheme(isDarkTheme: boolean) {
    this.isDarkTheme.next(isDarkTheme);
    localStorage.setItem(themeKey, this.isDarkTheme.value.toString());
  }

  getDarkTheme(): Observable<boolean> {
    return this.isDarkTheme;
  }

  setStickyHeader(isStickyHeader: boolean) {
    this.isStickyHeader.next(isStickyHeader);
    localStorage.setItem(themeKey, this.isStickyHeader.value.toString());
  }

  getStickyHeader(): Observable<boolean> {
    return this.isStickyHeader;
  }
}
