import { NgModule } from '@angular/core';
import {Routes, RouterModule, ExtraOptions} from '@angular/router';
import {FirstPageComponent} from "./first-page/first-page.component";
import {SecondPageComponent} from "./second-page/second-page.component";
import {LoginPageComponent} from "./auth/login-page/login-page.component";
import {SessionRequired} from "./auth/session-required.service";


const config: ExtraOptions = {
  scrollPositionRestoration: "top",
};

const routes: Routes = [
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
  { path: '',
    redirectTo: '/first-page',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
