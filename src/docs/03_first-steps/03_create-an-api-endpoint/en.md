# Create an API endpoint

## Introduction

In this third assignment, we will build an API endpoint.
This time, we will use the configuration repository to emulate data.

This tutorial will show you how to build a basic CRUD API application to manage a classic TODO list, with the `index`, `store`, `show`, `update` and `destroy` action.

Here are the key concepts that will be part of this tutorial:

 - The `serve` command
 - The `router` service (through the routes file and a view helper function)
 - The API routes file
 - The `Controller` class
 - Scaffolding controller with `make:controller`
 - The controller folder notation
 - The `config` repository
 - The `validator` service



## Launch the server

First, we need to start a server.

```bash
node ioc serve
```

This will start a new server process over port `8080`.
Try accessing [http://localhost:8080]().
You should see the default Web welcome page.
If you need to change port, use the `--port=8080` option, with the wanted port.

To develop faster, Node IoC provides a daemon feature that will relaunch the server on file change.

```bash
node ioc serve --daemon
```

Once the server has started, we can, in another terminal, run the Node Manager `watch` command.

```bash
npm run manager:watch
```

Now, we are ready to create our first Web page!



## Create the index route

Then, we need our API routes.
They are located in the `src/routes/api.js` file.

```javascript
export default (router) => {
    // The original comments were stripped out for easier readability.

    router.get('/app', 'AppController@index').name('app.index');
};
```

It's important to notice that the key difference between this file and the `web.js` routes file is that all the routes in the `api.js` file are prefixed by `/api` by default.
So, the `/app` route here is in fact a route that matches `/api/app` URL.

Let's add our first custom route.
It should point to `/todo`.

```javascript
export default (router) => {
    router.get('/app', 'AppController@index').name('app.index');

    router.get('/todo', (request, response) => {
        response.send('My first API endpoint');
    });
};
```

If you access to [http://localhost:8080/api/todo](), you should see `My first API endpoint`.

However, since we are working with API endpoint, it is strongly suggested that you use an appropriate tool.
We recommend using [Postman](https://www.getpostman.com/downloads/), or any API consumer tool.
You must be able to easily switch HTTP method and set request body.



## Create the controller

As we saw earlier in the previous tutorial, a `Controller` is needed to clearly separate our logic from the routes.

We also learned a useful command that create a controller class file for us, called `make:command`.

Let's check its signature through the `--help` flag.

```text
node ioc make:controller --help

ioc make:controller <class>

Create a controller class.

Options:
  --help         Show help                                                                                     [boolean]
  --version      Show version number                                                                           [boolean]
  -v, --verbose  Adjust the verbosity of the command                                                             [count]
  --destination  File destination.                                                              [string] [default: null]
  --resource     Generate a resource controller class.                                                         [boolean]
  --api          Generate an API resource controller class, without "create" and "edit" actions.               [boolean]
  --handler      Generate a single method handler controller class.                                            [boolean]
```

As we can see, there is some custom flags, such as `resource`, `api` and `handler`.
Each one of them indicates to create a specific type of controller.
In our case, we need an API controller, which implements the API CRUD methods that we want to implement.

Let's make our API controller, called `TodoController`.
And let's put it in a subfolder called `api`.

```bash
node ioc make:controller api/TodoController --api
```

This will automatically create a folder called `api`, if it did not exist, and create the `TodoController` file in this location.
With the `--api` flag, we indicate that we need a different scaffold.
Here what your new controller, located under `src/app/http/controllers/api/TodoController` looks like.

```javascript
class TodoController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @returns {response} The response.
     */
    index() {
        //
    }

    /**
     * Store a newly created resource.
     *
     * @returns {response} The response.
     */
    store() {
        //
    }

    /**
     * Display the specified resource.
     *
     * @returns {response} The response.
     */
    show() {
        //
    }

    /**
     * Update the specified resource.
     *
     * @returns {response} The response.
     */
    update() {
        //
    }

    /**
     * Remove the specified resource.
     *
     * @returns {response} The response.
     */
    destroy() {
        //
    }

}
```

Very cool, isn't it? Now, all we need to do is associate our route to our newly created controller.


```javascript
export default (router) => {
    router.get('/app', 'AppController@index').name('app.index');

    router.get('/todo', 'api.TodoController@index');
};
```

The folders are dotted separated in a controller.
It is treated the same as a service, which all follow the dotted syntax.

Finally, let's return a response in our `index` action in our controller.

```javascript
class TodoController extends Controller {

    index() {
        return this.json('My first JSON response');
    }

    /* ... */

}
```

Notice that we used the `json` method.
It accepts any JSON serializable value and handle all the formatting for you.
No need to `JSON.stringify` anymore.

If you access the endpoint, you should now see `"My first JSON response"`, as an `application/json` content type (notice the double quotes).


### Create the other routes

Now that we have a fully functional controller bound to a route, we should be able to create the other routes.

Let's create our `store` route, the one that should create an entity.

For the following routes, we will follow the [REST nomenclature](https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URI_and_HTTP_methods).


```javascript
export default (router) => {
    router.get('/todo',          'api.TodoController@index');
    router.post('/todo',         'api.TodoController@store');
    router.get('/todo/:todo',    'api.TodoController@show');
    router.patch('/todo/:todo',  'api.TodoController@update');
    router.delete('/todo/:todo', 'api.TodoController@destroy');
};
```

Those routes are the basic ones for any RESTful API architecture.
Since it happen too often, two special method from the `router` service was created, called `resource` and `apiResource`.

What they do is basically the same as we did, but automatically.

```javascript
export default (router) => {
    router.apiResource('todo', 'api.TodoController');
};
```

Much cleaner, isn't it? All we need to send to the `resource` or the `apiResource` method is the current resource name, which will be present in the URL, and the resource controller that will handle the requests.

The key difference between a `resource` and an `apiResource` (which will be reflected in the `make:controller`'s `--resource` and `--api`) is that the `resource` has two additional routes: `create` (`/resource/create`) and `edit` (`/resource/:id/edit`).
They are not present in an API resource since they should return a creation or an edition form, which does not make sense in an API.



## Implement the index action

To make our first CRUD application works, we need some data.
We could set up a local database, but let's keep it simple for now.

The `config` repository can be very helpful to handle application configuration through the framework modules, our own implementation, and also for third parties.
But let's use it another way: as a runtime database.

First, we need to inject the `config` repository in our controller.


```javascript
class TodoController extends Controller {

    static get dependencies() {
        return ['config'];
    }

    index() {
        return this.json(this.config.get('app.name'));
    }

    /* ... */

}
```

You should now see the application name instead of our placeholder sentence.



### The config repository

The configuration repository is one of the most useful ones.
It allows to use configuration to drive our entire application through `yaml` files.
It offers some methods, such as `get`, `set`, `has`, `merge`, etc.
The files in the `config` folder act like namespaces: the `app.name` key can be found in the `app.yaml` file, under the `name` YAML key.
The configuration repository accepts `.yaml`, `.yml`, `.js` and `.json` files to retrieve default configuration (however, your JavaScript ile must be written in CommonJS syntax, with `module.exports`).



### Return a todo list

Let's return the todo list.
It will be empty at first, but will be filled when we will implement the other CRUD methods.

```javascript
class TodoController extends Controller {

    /* ... */

    index() {
        const todos = this.config.get('todos', []); // The second argument is the default value

        return this.json(todos);
    }

    /* ... */

}
```

This will return an empty array.
But let's try to populate it manually to see how it reacts in a runtime environment.

```javascript
class TodoController extends Controller {

    /* ... */

    index() {
        const todos = this.config.get('todos', []).concat([{ label: 'My first todo', done: false }]);
        this.config.set('todos', todos);

        return this.json(todos);
    }

    /* ... */

}
```

If you reload the page, you should see `[{"name":"My first todo","done":false}]`.
But try to reload it another time.
Now, you have two todos, `[{"name":"My first todo","done":false},{"name":"My first todo","done":false}]`.
The configuration keeps the result in cache the whole time the application runs.

Now that we can assert that the configuration repository works, let's put the controller back the way it was.

```javascript
class TodoController extends Controller {

    /* ... */

    index() {
        const todos = this.config.get('todos', []);

        return this.json(todos);
    }

    /* ... */

}
```



### Implement the store action

The first action that will interact with our data is the `store` action.
Its role is to create a new entity.
We need to use the `POST` HTTP method.

Let's try with Postman, with the following url: `http://localhost:8080/api/todo` with the `POST` HTTP method, and let's return fake JSON response in the `store` controller action.

> In order to trap errors in JSON response instead of HTML, your request must have the `Accept: application/json` header.

```javascript
class TodoController extends Controller {

    /* ... */

    store() {
        return this.json('Storing new todo');
    }

    /* ... */

}
```

The two actions refers to the same URL, but with a different HTTP method, `GET` for `index`, and `POST` form `store`.
If you try to send a `POST` request to the `/api/todo` URL, you should see `"Storing new todo"` instead of `[]`.

This action normally expects that it receives a body containing the Todo data to be stored.
Let's establish a "todo" model for the backend side.

```json
{
  "id":    "number",
  "label": "string",
  "done":  "boolean"
}
```

However, the user only have to specify the `label` field, since it will not be done, and the ID is generated by the server.

```json
{
  "label": "string"
}
```

Let's send this body to the `store` action endpoint.

```json
{
  "label": "My first todo"
}
```

In the controller, we now need to retrieve the body.

```javascript
class TodoController extends Controller {

    /* ... */

    store() {
        return this.json(this.request.body);
    }

    /* ... */

}
```

You should see the whole request body in the response.

Now, let's create a todo.

```javascript
class TodoController extends Controller {

    /* ... */

    store() {
        const todos      = this.config.get('todo', []);
        const previousId = (todos[todos.length - 1] || {}).id || 0;

        const todo = {
        	...this.request.body,
        	id: previousId + 1,
            done: false,
        };

        todos.push(todo);
        this.config.set('todo', todos);        

        return this.json(todo);
    }

    /* ... */

}
```

It should add a new todo each time you make the request, with an incrementing ID.



### Validate data

We missed a very important part: validation.
We are assuming that the received body will match our expected model, but `label` may be an object, or we could have another unexpected key.

We can use the `validate` method in the controller to validate the current request body.

```javascript
class TodoController extends Controller {

    /* ... */

    store() {
        const todos      = this.config.get('todo', []);
        const previousId = (todos[todos.length - 1] || {}).id || 0;

        this.validate((validator) => {
            return {
                label: validator.string().min(3)
            }; 
        });

        const todo = {
        	...this.request.body,
        	id: previousId + 1,
            done: false,
        };

        todos.push(todo);
        this.config.set('todo', todos);        

        return this.json(todo);
    }

    /* ... */

}
```

The `validate` method accepts a callback that is used to validate each request body key against a validator schema.

The default validator is the well-known [@hapi/joi](https://hapi.dev/family/joi/) validation package.
You can use all the available methods and schema types.

Here we validate that the body contains (and contains only) a label that is a string with minimum length of 3 characters.

Now, create a todo, then go to the index endpoint.
Your todo should be there.



## Implement the show action

The show action is normally used to display a single resource item.
In our case, we should return the requested todo by ID.

The route URL schema is `/api/todo/:todo`.
Notice the last segment, which contains `:`.
It indicates that this segment is a variable that can be retrieved.

You can retrieve the route parameter in the controller through `this.request.params`.
In our case, it would be `this.reques.t.params.todo`.

```javascript
class TodoController extends Controller {

    /* ... */

    show() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todo = todos.find(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (!todo) {
            return this.notFound();
        }

        return this.json(todo);
    }

    /* ... */

}
```

Here, we retrieve the requested todo ID.
Then, we attempt to retrieve the corresponding todo.
With a database, we would have used `where` and `first` statements.

We used the ID as matcher, and we converted them to string to keep strict equality check (most backend developers like type tests and casting, let's use it too, even with a weakly-typed language)

Interesting fact, you can send a `404 Not Found.` very easily with the `notFound` method, but in a local environment, it converts to a `NotFoundHttpError` page, which is great for testing.
If you are not in a local environment, the real 404 page or JSON response will show up.

To be able to display a todo, ensure that your todo list contains the requested todo.
Friendly reminder that each time the server is stopped, the data disappear and you have to created them again.



## Implement the update action

Now, we can start updating an existing todo.
We should allow to update the label, but the done status as well.
The route to consume this API action is `/api/todo/:todo` with the `PATCH` HTTP method.

Here is the accepted schema

```json
{
  "label": "string|optional",
  "todo":  "boolean|optional"
}
```

Let's implement it, with validation of course!

```javascript
class TodoController extends Controller {

    /* ... */

    update() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todo = todos.find(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (!todo) {
            return this.notFound();
        }
        
        this.validate((validator) => {
            return {
                label: validator.string().optional(),
                done:  validator.boolean().optional()
            };
        });

        Object.assign(todo, this.request.body);

        this.config.set('todo', todos);

        return this.json(todo);
    }

    /* ... */

}
```



## Implement destroy action

Let's finally delete a todo.

```javascript
class TodoController extends Controller {

    /* ... */

    destroy() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todoIndex = todos.findIndex(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (todoIndex === -1) {
            return this.notFound();
        }

        todos.splice(todoIndex, 1);

        return this.noContent();
    }

}
```

To indicate that the content was deleted and nothing remains of it, a `204 No Content.` is returned.

Here is the final result:

```javascript
import Controller from '../Controller';


class TodoController extends Controller {

    static get dependencies() {
        return ['config'];
    }

    index() {
        return this.json(this.config.get('todo', []));
    }

    store() {
        const todos      = this.config.get('todo', []);
        const previousId = (todos[todos.length - 1] || {}).id || 0;

        this.validate((validator) => {
            return {
                label: validator.string().required()
            };
        });

        const todo = {
            ...this.request.body,
            id: previousId + 1,
            done: false
        };

        todos.push(todo);
        this.config.set('todo', todos);

        return this.json(todo);
    }

    show() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todo = todos.find(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (!todo) {
            return this.notFound();
        }

        return this.json(todo);
    }

    update() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todo = todos.find(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (!todo) {
            return this.notFound();
        }

        this.validate((validator) => {
            return {
                label: validator.string().optional(),
                done:  validator.boolean().optional()
            };
        });

        Object.assign(todo, this.request.body);

        this.config.set('todo', todos);

        return this.json(todo);
    }

    destroy() {
        const { todo: id } = this.request.params;
        const todos = this.config.get('todo', []);

        const todoIndex = todos.findIndex(({ id: todoId }) => {
            return todoId.toString() === id.toString();
        });

        if (todoIndex === -1) {
            return this.notFound();
        }

        todos.splice(todoIndex, 1);

        return this.noContent();
    }

}


export default TodoController;
```

Of course, all we did was a small CRUD todo application through a RESTful API, but you saw how to do it the _simple_ way.

We could have gone deeper by creating a service that handles all this process, to have a better separation of concern...

That's your next assignment!
