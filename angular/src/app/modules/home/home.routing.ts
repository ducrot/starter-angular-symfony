import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FirstPageComponent} from '@modules/home/page/first-page/first-page.component';
import {SecondPageComponent} from '@modules/home/page/second-page/second-page.component';
import {HomeComponent} from '@modules/home/page/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: '',
    children: [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
