# Directory structure

## Root folder

The root folder contains some important files that drives the application, as well as style and standards files.



### ioc

The `ioc` file is the starting point for your application through the CLI. It will only load the main application file, `dist/node/index.js` by default. It allows to use the base command `node ioc`.



### .env

The `.env` file is used to merge custom environment variable to the global ones. It will (and should be) ignored by Git, since it can contain sensitive data, such as passwords, key-secret pairs, etc. 

The `.env.example` is there to be used as a reference for your project. Feel free to change the example file while you develop your application to keep track of the changes and the new used variables. However, you should not write sensitive data in the example file, since it is part of your Git history.

The `APP_ENV` key in your `.env` file defines the application environment. If you want to do a quick smoke test, simply change the value in the `.env` file and run the following command:

```bash
node ioc env
```

This command displays the current application environment. You can rapidly make sure that the environment file is properly loaded.



### Node tester, ESLint and EditorConfig

To ensure that your application has the best code style, the [Absolunet](https://absolunet.com) [Node Tester](https://github.com/absolunet/node-tester) offers standards tests that parse your files for styling issues.

First, it uses the `.editorconfig` file to test basic code style for specified file extensions.

Then, the popular [ESLint](https://eslint.org/) is run through your entire application. The `.eslintrc.yaml` defines the rules that apply to your project. The `.eslintignore` file add exceptions for some files through folders and patterns. For information, you may read the [official documentation](https://eslint.org/docs/user-guide/configuring)

To run the standards tests, run the following commands
```bash
npm run test:standards
```



### Node Manager

The [Absolunet](https://absolunet.com) [Node Manager](https://github.com/absolunet/node-manager) is a great tool for you to use that makes node applications and packages very simple to maintain. The `manager.js` file define your current project type (it is already defined for you) and your `package.json` file defines all the commands that handle compilation, outdated dependencies check, documentation generation through [JSDoc](https://jsdoc.app/) and package deployment through an NPM registry, such as [npmjs.com](https://npmjs.com).

To compile your application, you can run the following command:

```bash
npm run manager:build
```

All the different commands are defined in the `package.json` file.



## Source folder

The source folder is located under `[root]/src`. It contains the application source code. Those are mainly JavaScript class files. The source directory will be explored in detail later in this page.



### Application folder

The bootstrap folder is located under `[root]/src/app`. It contains all your application-specific class files.



#### Console folder

The console folder is located under `[root]/src/app/console`. It contains all your console-related files, such as the main Kernel and the application command classes.



#### Exceptions folder

The exceptions folder is located under `[root]/src/app/exceptions`. It contains the main exception handler, as well as custom error classes.



#### HTTP folder

The HTTP folder is located under `[root]/src/app/http`. It contains all your HTTP-related classes, such as the controllers.



#### Providers folder

The providers folder is located under `[root]/src/app/providers`. It contains all your application service providers. By default, it contains `AppServiceProvider.js` and `RouteServiceProvider.js`.



### Bootstrap folder

The bootstrap folder is located under `[root]/src/bootstrap`. It contains the application bootstrap process file.



### Database folder

The database folder is located under `[root]/src/database`. It contains all the database-related files, such as the migrations, the models, the seeders and the model factories.



### Routes folder

The routes folder is located under `[root]/src/routes`. It contains all the application routes, by default split in two different files: `web.js` and `api.js`.



## Configuration folder

The configuration folder is located at `[root]/config`. It contains all the application configuration split into namespaces represented by files.

By default, you should retrieve the following files:

 - `app.yaml`
 - `cache.yaml`
 - `database.yaml`
 - `dev.yaml`
 - `events.yaml`
 - `http.yaml`
 - `logging.yaml`
 - `view.yaml`

Feel free to add any file you want. We suggest that the files uses the `.yaml` extension, but the `.js`, `.json` and `yml` extensions are all supported. Please note that commonJS syntax must be used in JavaScript configuration files since they are not compiled by the Node Manager.



## Distribution folder

The distribution folder is located under `[root]/dist`. It contains the compiled application files. You should never directly edit those files since they will be overwritten when compiling the application. You should always code in the `src` folder.



## Documentation folder

The distribution folder is located under `[root]/docs`. Since the application comes with the Node Manager by default, you have access to a JSDoc documentation website that is generated by the source code comments.

This folder will not be publicly accessible through the default application server routes, but can be deploy separately on another server (such as [Github pages](https://github.blog/2016-08-22-publish-your-project-documentation-with-github-pages/), or any custom server). This should be used only by developers.



## Node modules

The `node_modules` contains all the required dependencies of the project. This folder should never be edited and is generated when installing NPM packages. It contains the Node IoC framework, as well as its dependencies, and your own dependencies.



## Resources folder

The resources folder is located under `[root]/resources`. Not to be confused with the source code folder (`src`), the resources folder contains the application resources files, such as static files, HTML templates, etc. It does not contain any back-end related JavaScript files.

However, some of those files are used by the application.



### Language folder

The language folder is located under `[root]/resources/lang`. It contains all the translation files, with at least `translations.yaml`, the default one.



### Static folder

The static folder is located under `[root]/resources/static`. It contains any static files that can be used by your web application, such as the favicon, images, CSS, front-end JavaScript files, etc. However, the uploaded content should not go there. Those files will be tracked by Git and should be managed by the developers.



### Views folder

The views folder is located under `[root]/resources/views`. it contains all the HTML templates for your web application. Some of them already exists by default to show an example of how the Node IoC web application templating system works.

Those templates should not be used by the front-end engine, such as React or Vue.js, but only by the Node IoC back-end application.



## Storage folder

The storage folder is located under `[root]/storage`. It contains files that should be stored by the application, but that are environment specific. It contains cached data, logs, uploaded files, SQLite databases, etc. By default, the existing folder content is not tracked by Git.



### Databases storage folder

The databases storage folder is located under `[root]/storage/databases`. It contains all the application SQLite databases. Of course, it will not be part of the Git history.

Deleting the content means that the data stored in the database is lost forever. This folder is sensitive and should be well protected.



### Framework storage folder

The framework storage folder is located under `[root]/storage/framework`. It contains all the framework-specific files. Normally, you should not be concerned by this folder.

However, it is important to know that the file cache driver uses this folder to store data into `.json` files. Deleting the files will only affect the application cache and should not break anything. However, they can be created again by the application.



### Logs storage folder

The logs storage folder is located under `[root]/storage/logs`. All the application logs are dropped in this folder. You can delete the content anytime, but the logs will be lost. The log file driver can create files again anytime.



### Uploads storage folder

The uploads storage folder is located under `[root]/storage/uploads`. It contains all the files that were uploaded by the application. By default, they are considered as private, but they will be publicly accessible if put into the `[root]/storage/uploads/public` folder. This behaviour can be changed anytime by changing the routes.



## Tests folder

The tests folder is located under `[root]/test/`. It contains all the application tests, split by types.

 - unit
 - feature
 - integration
 - endtoend
 - generic

The `unit`, `feature`, `integration` and `endtoend` tests are all the same, except that they are namespaced by purpose and they run with different commands.

The `generic` tests are all the standards tests run by the Node tester.

When running `npm test`, it will go through all the standards tests, and will then run all the other test types one after the other.

When running `npm run test:unit`, it will only run unit tests. It is true for all of the default test folders.

The `bootstrap` folder should not be touched. It contains the tests bootstrapper. However, if you need to do anything regarding the application bootstrap in a test environment, feel free to do so.
