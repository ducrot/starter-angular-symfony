import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  private title = new Subject<string>();

  constructor() { }

  setTitle(title: string) {
    this.title.next(title);
  }

  clearTitle() {
    this.title.next();
  }

  getTitle(): Observable<string> {
    return this.title.asObservable();
  }
}
