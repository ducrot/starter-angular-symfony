import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptor } from '@app/interceptor/authentication.interceptor';
import { ServiceErrorInterceptor } from '@app/interceptor/service-error.interceptor';
import { throwIfAlreadyLoaded } from '@app/guard/module-import.guard';
import { ConstantsService } from "@app/service/constants.service";


@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    ConstantsService,
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
}
