import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import {throwIfAlreadyLoaded} from '@app/guard/module-import.guard';
import {environment} from '@env';
import {ConstantsService} from '@app/service/constants.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {I18nService} from '@app/service/i18n.service';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { registerLocaleData } from '@angular/common';
import {PbDatePipeModule, TwirpModule} from '@protobuf-ts/runtime-angular';
import {AuthenticationInterceptor} from '@app/interceptor/authentication.interceptor';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de', localeDeExtra);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    // Registers the `PbDatePipe` of @protobuf-ts/runtime-angular.
    // This pipe overrides the standard "date" pipe and adds support
    // for `google.protobuf.Timestamp` and `google.type.DateTime`.
    PbDatePipeModule,

    // Registers the `TwirpAngularTransport` with the given options
    // and sets up dependency injection.
    TwirpModule.forRoot({
      // the base url is taken from the environment
      baseUrl: environment.apiEndpoint,
      // for production, we use the binary format, otherwise, JSON
      sendJson: !environment.production,
      // you can use RPC interceptors here, or stick with Angular interceptors
      interceptors: [],
    })
  ],
  providers: [
    ConstantsService,
    I18nService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }

}
