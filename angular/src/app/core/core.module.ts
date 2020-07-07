import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { AuthenticationInterceptor } from '@app/interceptor/authentication.interceptor';
import { ServiceErrorInterceptor } from '@app/interceptor/service-error.interceptor';
import { throwIfAlreadyLoaded } from '@app/guard/module-import.guard';
import { PROTOBUF_RPC_ENDPOINT, ProtobufRpcHandler } from '@app/service/protobuf-rpc-handler.service';
import { environment } from '@env';
import { ConstantsService } from '@app/service/constants.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from '@app/service/i18n.service';

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
  ],
  providers: [
    ConstantsService,
    I18nService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceErrorInterceptor,
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
      providers: [
        ProtobufRpcHandler,
        {
          provide: PROTOBUF_RPC_ENDPOINT,
          useFactory: () => environment.apiEndpoint
        },
      ]
    };
  }

}
