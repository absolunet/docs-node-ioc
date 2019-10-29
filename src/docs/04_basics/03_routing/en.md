# Routing

## Introduction

Routing is the best way to assign HTTP requests to their handlers. This section will cover the Node IoC routing system, which is directly linked to [Express](https://expressjs.com/).



## Routes

The application routes are normally located in `src/routes` folder. They are loaded by the `src/app/providers/RouteServiceProvider`. This service provider loads both the `api.js` and the `web.js` files, one after the other, to separate the route types. All the `api.js` routes will be automatically prefixed by `/api`.



## Basic routing

The router uses expressive syntax, similar to what Express exposes. The router handles all basic HTTP verbs as method, an URL and a handler.

```javascript
router.get('/foo', (request, response) => {
    return response.write('Hello world!');
});
```

As a route handler, you can also define a controller action.

```javascript
router.get('/foo', 'FooController@index');
```

The syntax to use a controller action is `ControllerName@method`. Given the above example, here would be a valid implementation of the controller.

```javascript
class FooController extends Controller {

    index() {
        return this.response.write('Hello world!');
    }

}
```

The router handles the following basic methods:

 - `router.get(uri, handler)`
 - `router.post(uri, handler)`
 - `router.put(uri, handler)`
 - `router.patch(uri, handler)`
 - `router.delete(uri, handler)`



### Redirection routes

Sometime, application may handle redirection. It is always a better solution, regarding the performance, to handle the redirection from the server engine, such as Apache or Nginx configuration files. A simple solution was develop to handle those situations, for both temporary and permanent redirection.

 - `router.redirect(from, to)`
 - `router.permanentRedirect(from, to)`



### Static routes

Also, static content may come from dedicated folders. By default, the `/static` and `/uploads` routes are static assets routes, `/static` from the `path.public` folder and `/uploads` from the `path.upload`'s `public` folder. They are simply pointing to a folder, and the file tree will be taken in account to retrieve the file to serve.

Given the following file tree, here is the basic schema that the following route would handle with a file response.

```
/path/to/files/
    foo.txt
    bar/
        baz.txt
        qux/
            hello.txt
```

```javascript
router.static('/files', '/path/to/files');
// 'http://localhost:8080/files/foo.txt'       -> Serves '/path/to/files/foo.txt
// 'http://localhost:8080/files/bar/baz.txt'   -> Serves '/path/to/files/bar/baz.txt
// 'http://localhost:8080/files/qux/hello.txt' -> Serves '/path/to/files/qux/hello.txt
// 'http://localhost:8080/files/bar'           -> Return a "404 Not Found." response.
```



### Any verbs routes

It may occur that your route must handle any kind of verbs.

The `router.any(uri, handler)` method will create a route that will match any HTTP verbs.
The `router.all(uri, handler)` method is an alias of the `any` method.



### Fallback routes

Also, fallback routes may be very useful to handle single page application (SPA) built with React or Vue.js, for instance.

The `router.fallback(handler)` method will create a route that matches any path that was not matched yet by the defined routes. It prevents a 404 response from being sent. However, if you define this route before another specific route in the same group, the specific route will never match.



## Route parameters

A route can receive parameters, such as an ID/UUID, a username, a unique slug, etc. The way to define a route parameter is by using the colon token, such as `/:id`.

The entire route parameters will be available with the request's `params` property, the same way you would do with Express.

```javascript
router.get('/todo',       'TodoController@index');
router.get('/todo/:todo', 'TodoController@show');
```


### Constraints

To add constraints to a route parameter, you normally would use regular expression in the route signature, which some could find annoying for readability. Since the `route.get(uri, handler)` method returns a `Route` instance, you can use some useful methods. To add constraints, you can use the `where` method, which is chainable.

```javascript
router.get('/todo/:todo', 'TodoController@show')
    .where('todo', '[1-9]\d*');
```

This constraint indicates that, to match the following route, the `todo` parameter must be a valid positive number.



## Default values

If you are using a controller as the route handler, it may be useful to send some default values to it as parameters, such as resolvable instance, static values, etc.

```javascript
// src/routes/web.js
router.get('/foo', 'FooController@index')
    .with('connection', app.make('db').getDefaultConnection())
    .with('userId', 1);

// src/app/http/controllers/FooController.js
class FooController extends Controller {

    index({ connection, userId }) {
        // connection === the default connection
        // userId === 1
    }
}
```



## Named routes

It may be easy to reference a route by its URL, but you will have to change some of them, either for SEO reasons, localization, refactoring, etc. The named routes are a very simple way to prevent those refactor messes that you may encounter.

To name a route, the `Route` object exposes the `name` method.

```javascript
router.get('/foo', 'FooController@index')
    .name('foo.index');
```

With this simple additional line, you will be able to find your route very easily in the `router.route` repository.

```javascript
const route = app.make('router.route').findByName('foo.index'); // Route {}
route.path   === '/foo'; // true
route.action === 'FooController@index'; // true
```


## Groups

Grouping routes is a great idea to prevent all routes to have long URIs, complex naming structure that may have typos in it, and so on. The router offers the `group` method that accepts a group options object, and a callback that registers the routes in the group.

```javascript
router.group({ prefix: '/admin', as: 'admin.', namespace: 'backend.'}, () => {
    router.get('/',           'DashboardController@index').name('dashboard');
    router.get('/user',       'UserController@index').name('user.index');
    router.get('/user/:user', 'UserController@show').name('user.show');
});
```

This example will give the following pseudo-routes

```javascript
// { path: '/admin',            action: 'backend.DashboardController@index', as: 'admin.dashboard' }
// { path: '/admin/user',       action: 'backend.UserController@index',      as: 'admin.user.index' }
// { path: '/admin/user/:user', action: 'backend.UserController@show',       as: 'admin.user.show' }
```

You can also use groups inside groups

```javascript
router.group({ prefix: '/admin', as: 'admin.', namespace: 'backend.'}, () => {
    router.get('/', 'DashboardController@index').name('dashboard');

    router.group({ prefix: '/user', as: 'user.'}, () => {
        router.get('/',      'UserController@index').name('index');
        router.get('/:user', 'UserController@show').name('show');
    });
});
```

You can use the following group options:

 - `as`: The routes name prefix. Would end with a period if you want to define as route namespace.
 - `namespace`: Controller namespace. Should end with a period.
 - `prefix`: URI prefix segment. Can contain multiple segments.


## Resource routes

Most of the CRUD applications will implement the same routes:

 - `GET    /resource` to get a list page of the resource
 - `POST   /resource/create` to get the creation form for a new resource
 - `POST   /resource` to add a new resource record
 - `GET    /resource/:resource` to get a single resource record page
 - `GET    /resource/:resource/edit` to get the edition form for the current resource
 - `PATCH  /resource/:resource` to edit the current resource
 - `DELETE /resource/:resource` to delete the current resource

To simplify the routes, the `resource` method was defined to create all those routes automatically with a dedicated controller.

```javascript
router.resource('resource', 'ResourceController');
/*
// Same as this
router.group({ as: 'resource.', prefix: '/resource' }, () => {
    router.get('/',               'ResourceController@index').name('index');
    router.get('/create',         'ResourceController@create').name('create');
    router.post('/',              'ResourceController@store').name('store');
    router.get('/:resource',      'ResourceController@show').name('show');
    router.get('/:resource/edit', 'ResourceController@edit').name('edit');
    router.patch('/:resource',    'ResourceController@update').name('update');
    router.delete('/:resource',   'ResourceController@destroy').name('destroy');
});
 */
```

You can have only some routes defined by adding a third argument, which represents the route types that you need.

```javascript
router.resource('resource', 'ResourceController', ['index', 'create', 'store', 'show']);
/*
// Same as this
router.group({ as: 'resource.', prefix: '/resource' }, () => {
    router.get('/',               'ResourceController@index').name('index');
    router.get('/create',         'ResourceController@create').name('create');
    router.post('/',              'ResourceController@store').name('store');
    router.get('/:resource',      'ResourceController@show').name('show');
});
 */
```



### API resource

For API endpoints, the `create` and the `edit` routes have no reason to be present since the `store` and the `update` may come from form data outside the known ecosystem of the application.

The `apiResource` method will do the exact same thing than `resource`, but by omitting the `create` and `edit` routes.



## Controllers

A controller in Node IoC is a simple class that contains actions, which are methods. In your application, they are located in the `src/app/http/controllers` folder. An abstract `Controller` is already defined, empty and ready to be enhanced. It already inherits from the Controller class in the framework.


### Auto-registration

The application controllers are automatically registered in the `router.controller` repository, which contains all the known controllers.

Their file names, without the `.js` extension, is used as their name. If they are nested in a folder, the folder path becone the controller's namespace, replacing the slash by dots.

```
src/app/http/controllers/
    Controller.js              -> "Controller" (should never be directly used...)
    HomeController.js          -> "HomeController"
    api/
        TodoController.js      -> "api.TodoController"
    admin
        DashboardController.js -> "admin.DashboardController"
        people
            UserController.js  -> "admin.people.UserController"
```



### Register a controller

To manually register a controller, the `router.controller` repository offers a `add` method.

```javascript
import MyController from './MyController';

app.make('router.controller').add('MyController', MyController);
```

When registering a controller, they are bound to the application under their name.
The fact that the controller are in `PascalCase` clashes with the other services and should not entered in conflict.

You can retrieve a controller instance anytime by using the `get` method.

```javascript
app.make('router.controller').get('MyController'); // MyController {}
```



## Create a controller

To create a controller in your application, a simple command create the necessary scaffold of a controller that inherits from your base controller.

```bash
node ioc make:controller MyController
```

It will create an empty `MyController.js` controller class file inside the `src/app/http/controllers` folder.

You can create different kind of controller, such as a handler, a resource or an API resource controller.

```
node ioc make:controller DashboardController --handler
node ioc make:controller DashboardController --resource
node ioc make:controller DashboardController --api
```

A handler controller will only have a `handle` method. It is normally used for single action controller.
A resource controller defines all the resource actions: `index`, `create` `store`, `show`, `edit`, `update` and `destroy`.
An API controller defines all the API resource actions: `index`, `store`, `show`, `update` and `destroy`.



## Render views

To send an HTML response, the `view` method may be very useful to render a given view and send the result to the response object.

```javascript
class HomeController extends Controller {

    index() {
        return this.view('pages.home');
    }

}
```

You can also send view-mode data to the views as the second argument.

```javascript
class HomeController extends Controller {

    async index() {
        const weather = await this.app.make('weather').today();

        return this.view('pages.home', { weather });
    }

}
```



## Send JSON response

To send JSON response, the `json` method transform the given value to JSON and send it as an `application/json` response.

```javascript
class MyApiController extends Controller {

    index() {
        return this.json({
            foo: 'bar'
        });
    }

}
```



### Set HTTP status code

To send proper status code, some helper methods were defined:

 - `status(code)`: Set the status code manually
 - `throwWithStatus(status)`: Set the status code manually, the throw a corresponding HTTP error
 - `ok()`: Set `200 OK.` status code
 - `created()`: Set `201 Created.` status code
 - `accepted()`: Set `202 Accepted.` status code
 - `noContent()`: Set `204 No Content.` status code
 - `badRequest()`: Set `400 Bad Request.` status code and throws `BadRequestHttpError`
 - `unauthorized()`: Set `401 Unauthorized.` status code and throws `UnauthorizedHttpError`
 - `forbidden()`: Set `403 Forbidden.` status code and throws `ForbiddenHttpError`
 - `notFound()`: Set `404 Not Found.` status code and throws `NotFoundHttpError`
 - `methodNotAllowed()`: Set `405 Method Not Allowed.` status code and throws `MethodNotAllowedHttpError`
 - `timeout()`: Set `408 Timeout.` status code and throws `TimeoutHttpError`
 - `teapot()`: Set `418 Timeout.` status code

When an HTTP error is thrown, it is handled by the `exception.handler`, which will render the proper response for both JSON and HTML requests, depending on the current environment.
