import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { AuthAdminGuard } from '@app/guard/auth-admin.guard';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const config: ExtraOptions = {
  scrollPositionRestoration: 'top',
};

const routes: Routes = [

  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      },

      {
        path: 'admin',
        canActivate: [AuthGuard, AuthAdminGuard],
        canActivateChild: [AuthGuard, AuthAdminGuard],
        loadChildren: () =>
          import('@modules/admin/admin.module').then(m => m.AdminModule)
      },

      {
        path: 'general',
        loadChildren: () =>
          import('@modules/general/general.module').then(m => m.GeneralModule)
      },

      {
        path: 'auth',
        loadChildren: () =>
          import('@modules/auth/auth.module').then(m => m.AuthModule)
      },
    ]
  },

  {
    path: '**',
    component: ContentLayoutComponent,
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
