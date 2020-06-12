import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  readonly appName: string = 'My Application';
  readonly companyName: string = 'ACME CO';
  readonly supportedLanguages: string[] = ['en', 'de'];
  readonly defaultLanguage: string = 'en';

}
