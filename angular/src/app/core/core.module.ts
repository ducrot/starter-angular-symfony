import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { throwIfAlreadyLoaded } from '@app/guard/module-import.guard';
import { environment } from '@env';
import { ConstantsService } from '@app/service/constants.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from '@app/service/i18n.service';
import { AuthenticationRpcInterceptor } from '@app/interceptor/authentication-rpc-interceptor';
import { PbDatePipeModule, RPC_TRANSPORT } from '@protobuf-ts/runtime-angular';
import { TwirpFetchTransport } from '@protobuf-ts/twirp-transport';

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
    PbDatePipeModule,
  ],
  providers: [
    ConstantsService,
    I18nService,
    AuthenticationRpcInterceptor,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [

        // Configure Twirp as transport for all services,
        // with an authentication interceptor that adds a
        // token to each request.
        {
          provide: RPC_TRANSPORT,
          deps: [AuthenticationRpcInterceptor],
          useFactory: (authInterceptor: AuthenticationRpcInterceptor) => new TwirpFetchTransport({
            baseUrl: environment.apiEndpoint,
            interceptors: [authInterceptor],
            sendJson: true,
          })
        },

      ]
    };
  }

}
