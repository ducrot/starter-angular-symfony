import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '@modules/error-page/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/error-page',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: '',
        component: NotFoundComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPageRoutingModule {
}
