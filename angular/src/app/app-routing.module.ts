import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {FirstPageComponent} from './first-page/first-page.component';
import {SecondPageComponent} from './second-page/second-page.component';
import {SessionRequired} from '@app/service/session-required.service';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {DelayResolverService} from './delay-resolver.service';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const config: ExtraOptions = {
  scrollPositionRestoration: 'top',
};

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [SessionRequired],
    canActivateChild: [SessionRequired],
    resolve: {
      delay: DelayResolverService
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FirstPageComponent,
      },
      {
        path: 'first',
        pathMatch: 'full',
        component: FirstPageComponent,
      },
      {
        path: 'second',
        pathMatch: 'full',
        component: SecondPageComponent
      },
    ]
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
