import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {SessionRequired} from '@app/service/session-required.service';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';
import {ErrorPageLayoutComponent} from './layout/error-page-layout/error-page-layout.component';

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
    path: 'admin',
    component: ContentLayoutComponent,
    canActivate: [SessionRequired],
    canActivateChild: [SessionRequired],
    loadChildren: () =>
      import('@modules/admin/admin.module').then(m => m.AdminModule)
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: '**',
    component: ErrorPageLayoutComponent,
    loadChildren: () =>
      import('@modules/error-page/error-page.module').then(m => m.ErrorPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
