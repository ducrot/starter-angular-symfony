import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacyComponent } from '@modules/general/privacy/privacy.component';
import { LegalComponent } from '@modules/general/legal/legal.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/general/legal',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'legal',
        pathMatch: 'full',
        component: LegalComponent,
      },
      {
        path: 'privacy',
        pathMatch: 'full',
        component: PrivacyComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule {
}
