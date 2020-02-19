# Installation

## Server requirements

The Node IoC has some basic server requirements.
You need to have a globally installed Node.js binary at version `>= 12`.
It was tested on Nginx 1.16.1, as well as on Apache 2.0.
It was also tested locally on a Windows 10 distribution, but nothing has been tested on a Windows IIS server yet.

You will also need NPM at version `>=6.9.0` (stable) or Yarn at version `>=1.19.1` (stable)



## Create a new Node IoC application

To create a new Node IoC application, you may clone (or download) the official [Node IoC application scaffold](https://github.com/absolunet/node-ioc-app).
This repository is always up to date to the last framework version.
It provides everything needed to quickly start a new Node.js project.

```bash
cd [your-working-directory]
git clone https://github.com/absolunet/node-ioc-app.git [your-application-name]
cd [your-application-name]
```

With this method, you will download the Git history as well.
Simply delete the `.git` folder and start a fresh history with `git init` (if you are working with Git as your SVN)

Now that the application was downloaded, install the project dependencies, with the development dependencies so you can test your application.

```bash
npm install
# or
yarn
```

_From now on, NPM will be used for examples_



## Compile source code

The application, as well as the framework, was built with the latest ES6+ features.
In order to properly work on an older environment, without experimental flags or unstable implementation, they rely on Babel transpiler, which basically converts EcmaScript Modules (ESM) to CommonJS, the default Node.js modular system.
That being said, you are free to use any JavaScript preprocessor you want, such as TypeScript.
However, the application comes with vanilla JavaScript only, without any TypeScript definition.



### Node Manager

To compile your code, [Absolunet](https://absolunet.com) as built a [Node Manager](https://github.com/absolunet/node-manager) to facilitate code compilation, outdated dependencies reports, package deployment, API documentation generation and much more.
By the way, feel free to check the amazing [Absolunet public packages](https://github.com/absolunet)!



### Compile using Node Manager

To compile the source code, simply run the manager task:

```bash
npm run manager:build
```

You can also use the build watch feature so you can quickly develop without having to manually compile your source code.

```bash
npm run manager:watch
```

Node Manager uses Webpack bundler under the hood.
You won't have to bother all the compilation configuration, everything is already set up for you.
If you feel that some additional configuration is needed, please read the official [Node Manager documentation](https://documentation.absolunet.com/node-manager).



## Run CLI

Now that your application has been compiled, you are ready to use Node IoC.
The basic command to run your application CLI must start by `node ioc`, followed by your command.

```bash
node ioc
```

This should display the list of available command, that should look like this:

```text
Node IoC

Usage:
  command [arguments] [options]

Available commands:
   env           Display the application environment.
   list          List all available commands.
   serve         Serve the application.
  cache
   cache:clear   Flush the application cache.
   cache:forget  Remove an item from the cache.

Options:
  --help         Show help
  --version      Show version number
  -v, --verbose  Adjust the verbosity of the command
```

You can also use this alias

```bash
node ioc list
```

When you start using the application, you will only have a few commands available, for multiple reasons:
 - Your environment has not been set yet
 - You don't have any module installed
 - You have not built your own commands yet



## Run server

One of the available command is called `serve`.
It starts your application HTTP server, which is powered by Express.

To start the server, use this command:

```bash
node ioc serve
```

You should see `This is serving on port 8080...` appearing, indicating that your server has successfully started.
You can now visit your application website through [http://localhost:8080](http://localhost:8080).
A basic website scaffold comes with the application for example purpose, but feel free to change whatever you want.

The port remains configurable with the `--port` option.
If you want to know how a command works, you can use the `--help` flag.

```bash
node ioc serve --help
```

It will show you something like this:

```text
ioc serve

Serve the application.

Options:
  --help          Show help                                                                                    [boolean]
  --version       Show version number                                                                          [boolean]
  -v, --verbose   Adjust the verbosity of the command                                                            [count]
  --port          Port to use to serve the application.                                         [string] [default: 8080]
  --daemon        Use a daemon to automatically restart the serve process when a file has changed.             [boolean]
  --silent        Silently run the process without any console output.                                         [boolean]
  --start-silent  Silently start the process, but still output data in the console afterward.                  [boolean]
```



## Configuration

### Configure Node.js HTTP proxy

In a conventional server, the ports 80 and 443 are already reserved in order to serve content.
With this constraint, a reverse proxy must be configured to redirect port 80 (or 443) requests to the application port (8080 by default).



#### Apache

Here is the basic configuration for Apache server.

```apacheconfig
<VirtualHost *:80>
    ServerName myApp
    ServerAlias my-app.example.com
    DocumentRoot /var/www/my_app

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full


    <Directory "/">
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted

        # Here, we indicate that any requests made to "http://my-app.example.com"
        # domain, on port 80, are actually made to "http://localhost:8080".
        # If a request to the page "http://my-app.example.com/foo/bar" is made,
        # apache will resolve the response through "http://localhost:8080/foo/bar".

        ProxyPass http://localhost:8080
        ProxyPassReverse http://localhost:8080
    </Directory>

    <Proxy *>
        Require all granted
    </Proxy>
</VirtualHost>
```



#### Nginx

Here is the basic configuration for Nginx server.

```
server {
    index index.html;
    server_name my-app.example.com;
    root /var/www/my_app;
    listen 80;

    location / {

        # Here, we indicate that any request made to "http://my-app.example.com"
        # domain, on port 80, are actually made to "http://localhost:8080".
        # If a request to the page "http://my-app.example.com/foo/bar" is made,
        # nginx will resolve the response through "http://localhost:8080/foo/bar".

        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```



### Configure process management

Since Node.js is an engine that is not bootstrapped my the Apache or the Nginx server, it must be started manually.
The `node ioc serve` starts a new process that listens to the HTTP port 8080.
However, in order to make this process automatically started on server boot, a process manager can be a very good help to monitor the process and ensure that it is fully running anytime.



#### PM2

[PM2](http://pm2.keymetrics.io/) os one of the most popular Node.js production process manager.
It allows to easily manage, start, stop, restart and monitor processes.

First, install the package globally.

```bash
npm install -g pm2
```

Then, go to your application directory and run the command to create the pm2 service instance.

```bash
pm2 start "node ioc serve" --name "my-app"
```

This will first create the `my-app` process into PM2, then it will start the process.
Your application will then run at port 8080.
The reverse proxy will then do the trick to enable your website over port 80 or 443.

You can stop the process by running the following command.

```bash
pm2 stop my-app
```

If you want to restart it, simply use your process name.

```bash
pm2 start my-app
```

To enable PM2 to start on server boot, please follow the [official documentation](http://pm2.keymetrics.io/docs/usage/startup/).



### Configuration files

Node IoC make it very easy to manage packages and framework behavior through configuration files.
Those files are located under the `config` folder.
The configuration system supports `.yaml`, `yml`, `.js` and `.json` files.
By default, `.yaml` files are being used, mostly for readability.
If you are using `.js` files, make sure that you are using common.js syntax (`module.exports = {}`) instead of EcmaScript modules (`export default {}`), since those files are never compiled.

However, here are the key points:

 - A configuration can contain any type of JSON-compatible value: null, string, number, boolean, object or array
 - Dotted string notation is used to access configuration; the config keys must not contain dots
 - The configuration namespaces are the file names (eg: `foo.bar` references to the `bar` first-level key inside `foo.yaml` file)
 - To reference the application root path, the value must start by `@/` (eg: `@/storage/logs/ioc.log`)
 - To reference the home directory path the value myst start by `~/` (eg: `~/.ssh/id_rsa.pub`)
 - To reference an environment variable, the value must contain double mustaches (eg: `{{SOME_VARIABLE}}`)
 - To reference an environment variable with a fallback value, you must use a pipe to separate the variable from the default value (eg: `{{SOME_VARIABLE|default value}}`)
 - An environment variable can be used inside a value (eg: `foo_{{SOME_VARIABLE}}_bar`, `{{SOME_VARIABLE|table_name}}.column_name`)



### Environment

The environment is very useful to quickly adapt configuration from a local machine to the production server.
The configuration can directly references the environment variable with the double mustache syntax.
However, to ensure that the environment remains simple to manage, a `.env` file can be used in your application.
Every key-value pair will be merged in the existing environment during your application execution time.
A `.env.example` is provided by default in the application repository.
Simply copy the file with the name `.env` and change the appropriate values, such as `APP_ENV`, that will specify the application environment, such as `local`, `test`, `staging` or `production`.
The environment repository can be used to safely retrieve environment variable (eg: `app.make('env').get('APP_ENV', 'production')` (get `APP_ENV` environment variable value, with `production` as default value)).
If the file does not exist, the current environment will still be accessible through the application and the environment repository.



### Directory permissions

The whole project must be accessible in _read_ mode for your application, in order to require and execute JavaScript files and read configuration and environment files.
However, the `storage` directory must be writable by your application, since logs, cache, SQLite database and uploaded files are stored in this directory.

```bash
sudo chgrp -R www-data storage
sudo chmod -R ug+rwx storage
```
