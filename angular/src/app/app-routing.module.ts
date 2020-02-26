import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {FirstPageComponent} from "./first-page/first-page.component";
import {SecondPageComponent} from "./second-page/second-page.component";
import {LoginPageComponent} from "./auth/login-page/login-page.component";
import {SessionRequired} from "./auth/session-required.service";
import {NotFoundPageComponent} from "./not-found-page/not-found-page.component";


const config: ExtraOptions = {
  scrollPositionRestoration: "top",
};

const routes: Routes = [

  // redirect to the start page
  { path: '',
    redirectTo: '/first-page',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'first-page',
    component: FirstPageComponent,
    canActivate: [SessionRequired],
  },
  {
    path: 'second-page',
    component: SecondPageComponent,
  },

  // fallback page
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
