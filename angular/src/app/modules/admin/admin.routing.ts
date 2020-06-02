import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersPageComponent} from "@modules/admin/page/users-page/users-page.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UsersPageComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
