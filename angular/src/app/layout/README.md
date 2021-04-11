Layout Directory
================

`~/src/app/layout`

The layout directory is a container of components which are declared in the AppModule. The directory contains page-level
components of content such as a common header, navigation, and footer. It also contains page layouts for the different
sections of the application.

Components like header and footer are handled the Angular way by importing them into a template:

```typescript
<app-header></app-header>
<div>Some other content</div>
<app-footer></app-footer>
```

Layouts determine the basic presentation and are very flexible. By using child routes a top level route can define a
layout to be used for its children. Each module has its own routing so the top level `AppRoutingModule` includes the
module as a child of a route. This code block is taken from
`app-routing.module.ts` and trimmed of extra content:

```typescript
{
  path: '',
  component: ContentLayoutComponent,
  children: [
    {
      path: 'general',
      loadChildren: () =>
        import('@modules/general/general.module').then(m => m.GeneralModule)
    },
  ]
}
```

When a route is called at `/general` the `ContentLayoutComponent` is used as a layout and handling of the routing is
handed off to the `GeneralModule`. The `ContentLayoutComponent` has a `router-outlet`.

This `router-outlet` is used to display a route and component defined in the routing of the `GeneralRoutingModule`:

```typescript
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
}
```

So the routes are `/general/legal` and `/genral/privacy` and they use the `ContentLayoutComponent` for their layout.
