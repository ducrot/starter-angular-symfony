starter-angular-symfony
=======================


# features

- authentication via JWT, login, logout, session expiration support
- angular production builds delivered by symfony (with proper caching)
- automatic JSON formatting of exceptions for angular client (stack traces if symfony debug = true)
- each request is tagged with a unique id, id is logged with every log record, delivered to client 


# symfony

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
symfony console doctrine:schema:update --force
```

Create a first admin account. Additional users can be created in the application.

```shell script
symfony console backend:createadmin testuser@domain.tld testpassword
```


# angular

The angular part is located in the `angular` directory. 

The project was setup with node version v12.12.0 and npm version 6.11.3. 

Run `npm install` to install dependencies. 

To start a development server, run the following command:

```shell script
cd angular
node_modules/.bin/ng serve 
```

If your have the angular CLI globally installed, you can simply run `ng serve`.



# production builds

Make angular production build: 

```shell script
node_modules/.bin/ng build --prod --deleteOutputPath=false
```

Production builds are automatically delivered by symfony. See FrontendController.php.


# testing

```shell script
# run all tests of the application
php bin/phpunit

# Run all tests in the Foo/ directory
php bin/phpunit tests/Foo

# Run all tests in the Foo class 
php bin/phpunit tests/Foo/FooTest.php
```
