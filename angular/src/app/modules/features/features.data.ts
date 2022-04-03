import { environment as env } from '@env';

export interface Feature {
  name: string;
  version?: string;
  description: string;
  github?: string;
  documentation: string;
  medium?: string;
}

export const features: Feature[] = [
  {
    name: 'Angular',
    version: env.versions.angular,
    description: 'app.features.angular',
    github: 'https://github.com/angular/angular',
    documentation: 'https://angular.io/docs/ts/latest/'
  },
  {
    name: 'Angular Cli',
    version: env.versions.angularCli,
    description: 'app.features.angular-cli',
    github: 'https://github.com/angular/angular-cli',
    documentation: 'https://cli.angular.io/'
  },
  {
    name: 'Angular Material',
    version: env.versions.material,
    description: 'app.features.angular-material',
    github: 'https://github.com/angular/material2/',
    documentation: 'https://material.angular.io/'
  },
  {
    name: 'Angular Flex-Layout',
    version: env.versions.flexLayout,
    description: 'app.features.angular-material',
    github: 'https://github.com/angular/flex-layout',
    documentation: 'https://github.com/angular/flex-layout/wiki/API-Documentation'
  },
  {
    name: 'Tailwind',
    version: env.versions.tailwind,
    description: 'app.features.tailwind',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    documentation: 'https://tailwindcss.com/docs/installation'
  },
  {
    name: 'Tailwind Config Viewer',
    description: 'app.features.tailwind-config-viewer',
    github: 'https://github.com/rogden/tailwind-config-viewer',
    documentation: 'https://tailwindcss.com/docs/installation'
  },
  {
    name: 'RxJS',
    version: env.versions.rxjs,
    description: 'app.features.rxjs',
    github: 'https://github.com/ReactiveX/RxJS',
    documentation: 'https://rxjs-dev.firebaseapp.com/',
    medium: 'https://medium.com/@tomastrajan/practical-rxjs-in-the-wild-requests-with-concatmap-vs-mergemap-vs-forkjoin-11e5b2efe293'
  },
  {
    name: 'Typescript',
    version: env.versions.typescript,
    description: 'app.features.typescript',
    github: 'https://github.com/Microsoft/TypeScript',
    documentation: 'https://www.typescriptlang.org/docs/home.html'
  },
  {
    name: 'I18n',
    version: env.versions.ngxtranslate,
    description: 'app.features.ngxtranslate',
    github: 'https://github.com/ngx-translate/core',
    documentation: 'http://www.ngx-translate.com/'
  },
  {
    name: 'Font Awesome',
    version: env.versions.fontAwesome,
    description: 'app.features.fontawesome',
    github: 'https://github.com/FortAwesome/Font-Awesome',
    documentation: 'https://fontawesome.com/icons'
  },
  {
    name: 'app.features.themes.title',
    description: 'app.features.themes.description',
    documentation: 'https://material.angular.io/guide/theming',
    medium: 'https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1'
  },
  {
    name: 'app.features.protobuf.title',
    description: 'app.features.protobuf.description',
    documentation: 'https://developers.google.com/protocol-buffers/docs/proto3'
  },
  {
    name: 'app.features.folderstructure.title',
    description: 'app.features.folderstructure.description',
    github: 'https://github.com/mathisGarberg/angular-folder-structure',
    documentation: 'https://angular-folder-structure.readthedocs.io/en/latest/index.html'
  },
  {
    name: 'app.features.lazyloading.title',
    description: 'app.features.lazyloading.description',
    documentation: 'https://angular.io/guide/router#lazy-loading-route-configuration'
  },
  {
    name: 'app.features.symfony.title',
    description: 'app.features.symfony.description',
    github: 'https://github.com/symfony/symfony',
    documentation: 'https://symfony.com/doc/current/index.html'
  },
];
