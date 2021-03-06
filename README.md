starter-angular-symfony
=======================


## Features

- authentication via JWT, login, logout, session expiration support
- angular production builds delivered by symfony (with proper caching)
- all data exchange between server and frontend uses [Twirp](https://twitchtv.github.io/twirp/docs/intro.html) and [Protocol buffers](https://developers.google.com/protocol-buffers)
- automatic formatting of exceptions for angular client (stack traces if symfony debug = true)
- each request is tagged with a unique id, id is logged with every log record, delivered to client


# Install

```shell script
# Clone with SSH
git clone git@github.com:ducrot/starter-angular-symfony.git my-project
# Clone with HTTPS
git clone https://github.com/ducrot/starter-angular-symfony.git my-project
cd my-project
make install
```


## Protobuf and twirp

For exchanging data between server and frontend, [Twirp](https://twitchtv.github.io/twirp/docs/intro.html)
is used. It is a very simple protocol based on HTTP/1 that serializes all data 
using [protobuf](https://developers.google.com/protocol-buffers). See `protos/` 
directory for the message and service definitions. 

For the first installation and after adding or changing a .proto file, run `make generate` to 
generate Typescript and PHP code.

You need the protobuf compiler `protoc` for that. Run `brew install protobuf` or 
`sudo port install protobuf3-cpp` or download a release for your OS 
[here](https://github.com/protocolbuffers/protobuf/releases) 
and follow the installation instructions.

This will write PHP files to `symfony/src-pb` and typescript files to `angular/src/pb`.   

To add a new service: 
- Create the service in a new .proto file in the `/protos/` directory.
- Run `make generate`.
- A PHP interface for your service has been created in `symfony/src-pb`.
- Create a new class in `symfony/services/<your-service-name>.php` 
  and implement the generated interface with your logic.
- Register your service implementation in `TwirpController::MAPPINGS`.
- Register the (autogenerated) Typescript client in an angular module of 
  your choice. See `shared.module.ts` for examples. 


## Symfony

The symfony part is located in the `symfony` directory. 

Run `composer install` to install dependencies.

To install the `symfony` command (standard for symfony v5), run the following 
command: 

```shell script
curl -sS https://get.symfony.com/cli/installer | bash
```

You can start a symfony development server using: 

```shell script
cd symfony
symfony server:start
```

Set database credentials in `.env.local` and create database tables/schema:

```shell script
symfony console doctrine:database:create
symfony console doctrine:schema:create
symfony console doctrine:schema:validate
```

Create a first admin account. Additional users can be created in the application.

```shell script
symfony console backend:createadmin testuser@domain.tld 'A#Very$ecretPwd'
```

Or import fixtures which will be generated with Alice and Faker.

```shell script
symfony console hautelook:fixtures:load
```


## Angular

The angular part is located in the `angular` directory. 

The project was tested with node v16.x and yarn v1.x.

Run `yarn install` to install dependencies. 

To start a development server, run the following command:

```shell script
cd angular
node_modules/.bin/ng serve
```

If your have the angular CLI globally installed, you can simply run `ng serve`.


### Tailwind CSS

The utility-first CSS framework [Tailwind CSS](https://tailwindcss.com) is configured out of the box.

To view all possible classes in your brwoser start the [Tailwind Config Viewer](https://github.com/rogden/tailwind-config-viewer) with `yarn run tailwind-config-viewer`.


## Production builds

Make angular production build: 

```shell script
node_modules/.bin/ng build --prod --deleteOutputPath=false
```

Production builds are automatically delivered by symfony. See FrontendController.php.


## Testing

```shell script
# run all tests of the application
php bin/phpunit

# Run all tests in the Foo/ directory
php bin/phpunit tests/Foo

# Run all tests in the Foo class 
php bin/phpunit tests/Foo/FooTest.php
```


## credits

- The ACME logo was created by [Acme Logos - Professional Placeholder Logos](http://acmelogos.com/).
- Used ideas on best practices from [Angular Folder Structure](https://github.com/mathisGarberg/angular-folder-structure).
- Special thanks for the support and the fantastic protobuf-ts goes to [timostamm/protobuf-ts](https://github.com/timostamm/protobuf-ts).
