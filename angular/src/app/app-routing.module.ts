import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {SessionRequired} from '@app/service/session-required.service';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';

const config: ExtraOptions = {
  scrollPositionRestoration: 'top',
};

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [SessionRequired],
    canActivateChild: [SessionRequired],
    loadChildren: () =>
      import('@modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthModule)
  },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
