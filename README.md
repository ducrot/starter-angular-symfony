starter-angular-symfony
=======================



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
