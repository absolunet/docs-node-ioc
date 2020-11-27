# Create a service

## Introduction

_The API endpoint assignment must be completed to start this one since it uses the same controller and refactors it._

Services, repositories, factories, builders, drivers, engines, handlers... Those are all common terms for backend developers.

If you are new to this world, it's important to understand the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles.

The first principle that it defines is the _**S**ingle responsibility principle_, which states that each function, class, method, file, etc., must have a single purpose, a unique responsibility regarding your application.
It makes it easier to maintain, to test, to predict and to use.
We refer to classes that have too many responsibilities as _God class_.

So, if a controller has business logic in it, it does not comply with the SOLID principle.
The controller's role is to handle the request and to return a response matching the request, not to interact with a database or to send emails.

In this assignment, we will create a `TodoService` that will perfectly fit with the previous assignment.
In the last assignment, the controller itself managed the business logic of the todos.
Let's split those two responsibilities.



## What is a service?

Essentially, a service manages the business (or the application) logic.
They are separated by concerns and can use other services, repositories and so on.
In an eCommerce platform, for instance, it is very usual to have a `CustomerService`, a `ProductService` and an `OrderService`, each of them exposing methods to interact with the data by using the programmed business logic.

In our case, the `TodoService` that we will create will essentially expose the CRUD methods, but with some verbosity in it: instead of `index`, we will call `all()`, or `getAllTodos()`, whatever is verbose enough for you, and those who will read or use the code.

> Indeed, the ratio of time spent reading versus writing is well over 10 to 1.
> We are constantly reading old code as part of the effort to write new code.
> ...[Therefore,] making it easy to read makes it easier to write.
>
> --- _Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship_



## Create the TodoService

First, let's create our first service.
Unlike the other times, there is no command to scaffold a service since they are normally completely custom.

Let's create a `services` folder under `src/app`, to group our services.
Then, we can create a `TodoService.js` file in it.

Here is the basic content:

```javascript
class TodoService {

}


export default TodoService;
```

Normally, any Node.js developer would go in their `TodoController` and `import TodoService from '../../../services/TodoService`.
Not in Node IoC.
**NEVER** do this in Node IoC.
Why? Why using Node IoC in the first place.
From the beginning, we injected `config` and `http`, the controller used the application to build `validator` and `view`, without importing anything.
We should work the same way!

To make a service injectable, only two lines of code are required, and those lines will be located in a `ServiceProvider`.
In our application, we have two service providers: the `AppServiceProvider`, which should be used for service registration and third party initialization, and `RouteServiceProvider`, which load the routes into the router.

Inside the `src/app/providers/AppServiceProvider`, you will see two methods: `register` and `boot`.
The `register` is perfectly suited to bind a service in the application to make it injectable.

```javascript
import { ServiceProvider } from '@absolunet/ioc';
import TodoService from '../services/TodoService';


/**
 * Application service provider.
 */
class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     */
    register() {
        // You may register any service either as a binding or a singleton using
        // this.app.bind('service.name', concrete) or
        // this.app.singleton('service.name', concrete).
        // However, you should not use any service since some services may not be available yet.
        this.app.singleton('todo', TodoService);
    }

    /**
     * Bootstrap any application services.
     */
    boot() {
        // You may use services here to bootstrap them.
        // You can get a service instance using this.app.make('service.name').
    }

}
```

We will use the `singleton` binding method to prevent creating a new instance each time it is registered.

Now that we made a service, let's try to inject it in our `TodoController`.

```javascript
class TodoController extends Controller {

    static get dependencies() {
        return ['config', 'todo'];
    }

    index() {
        return this.dump(this.todo);
        // return this.json(this.config.get('todo', []));
    }

    /* ... */

}
```

In the dumped page, you should see `( TodoService #1 ) { ▸ }`.
Your service was successfully instantiated!
We can now start to implement it.



## Describe the methods

Here are the main actions (as a TypeScript interface) that we want to perform over our todos:

 - `getAll(): Array<Todo>;`
 - `create(data: CreateTodoModel): Todo;`
 - `findById(id: number): Todo;`
 - `existById(id): boolean;`
 - `updateById(id: number, data: UpdateTodoModel): Todo;`
 - `deleteById(id: number): void;`

They are much more verbose than `index` or `show`, aren't they?
Now, let's write our methods in the service.

```javascript
class TodoService {

    getAll() {
        //
    }

    create(data) {
        //
    }

    existById(id) {
        //
    }

    findById(id) {
        //
    }

    updateById(id, data) {
        //
    }

    deleteById(id) {
        //
    }

}
```



## Refactor the controller

Let's use the service in the controller instead of the config repository and all the business logic.
However, the validation should remain.
It is still the controller's responsibility to validate the request.

```javascript
class TodoController extends Controller {

    static get dependencies() {
        return ['todo'];
    }

    index() {
        return this.json(this.todo.getAll());
    }

    store() {
        this.validate((validator) => {
            return {
                label: validator.string().required()
            };
        });

        return this.json(this.todo.create(this.request.body));
    }

    show() {
        const id = Number(this.request.params.todo);
        const todo = this.todo.findById(id);

        if (!todo) {
            return this.notFound();
        }

        return this.json(todo);
    }

    update() {
        const id = Number(this.request.params.todo);

        if (!this.todo.existById(id)) {
            return this.notFound();
        }

        this.validate((validator) => {
            return {
                label: validator.string().optional(),
                done:  validator.boolean().optional()
            };
        });

        return this.json(this.todo.updateById(id, this.request.body));
    }

    destroy() {
        const id = Number(this.request.params.todo);

        if (!this.todo.existById(id)) {
            return this.notFound();
        }

        this.todo.deleteById(id);

        return this.noContent();
    }

}
```

As you can see in this refactored controller, there is no business logic, just request handling (request body validation, service actions execution and response process).

Now, we need to implement the `TodoService` methods.



## Implement the service

### Implement getAll()

Let's tackle our first method, `getAll`, which should return an array of todos, as described above.

Before implementing it, we need to store the todos somewhere.
The `config` repository was just for demonstration...
It is not its purpose, so we should not use it anymore.

In fact, we just need a repository to store them.
We could create a `TodoRepository` to manage the todo store, but let's implement a single service for now.

Normally, in object-oriented programming, we would use private property to store the todos.
In JavaScript, the encapsulation is not yet implemented (written in early 2020, take a look at [this TC39 proposal](https://github.com/tc39/proposal-class-fields) to validate that statement).
However, Absolunet offers an easy to use tool to emulate encapsulation with the `[@absolunet/private-registry](https://github.com/absolunet/node-private-registry)` package.
Of course, it is not as strong as real encapsulation, but it's still a good starting point.

Let's use it.
This time, since it should be kept private, you can `import` it.

```javascript
import __ from '@absolunet/private-registry';


class TodoService {

    /* ... */

}
```

Normally, what we would do is initializing our data in the constructor, like this:

```javascript
class TodoService {

    constructor() {
        __(this).set('todos', []);
    }

}
```

However, since the dependency injection occurs at this time, and the dependencies are not yet dynamically assigned, Node IoC offers another starting point for initialization, through the `init` method.

```javascript
class TodoService {

    init() {
        __(this).set('todos', []);
    }

}
```

In the container instantiation cycle, the instance's dependencies are resolved.
An instance is created, with the resolved dependencies passed as arguments.
They are then dynamically assigned, and finally, the `init` method is called.

In the `init` method, you can assume that everything is properly set up, and the instance is ready to work.

Now that the todos are saved somewhere, let's implement the `getAll` method.


```javascript
class TodoService {

    init() {
        __(this).set('todos', []);
    }

    getAll() {
        return __(this).get('todos').map((todo) => {
            return { ...todo };
        });
    }

}
```

Here, a new array, with all the todos in it, is returned, to prevent that the array is directly modified by the caller.
It would remove the meaning of a private member.

The same thing is done for all the todos.
They are transformed into an identical object, but in another instance, to prevent direct modification.

Let's try to call the `/api/todo` route.
We should have an empty array as the response.



### Implement create()

Now, we can create a new todo and store it in the private registry.
We can keep track of an incrementing ID, which would be much cleaner than what we have done previously in the controller.

```javascript
class TodoService {

    init() {
        __(this).set('todos', []);
        __(this).set('id', 0);
    }

    /* ... */

    create({ label }) {
        const _this = __(this).get();
        const id    = ++_this.id;

        const todo = {
            done: false,
            id,
            label
        };

        _this.todos.push(todo);

        return todo;
    }

}
```



### Implement findById()

Finding the todo by ID should be simple, it's basically the same thing that we did in the controller during the last assignment.

```javascript
class TodoService {

    /* ... */

    findById(id) {
        const todos = __(this).get('todos');

        const todo = todos.find(({ id: todoId }) => {
            return todoId === id;
        });

        return todo ? { ...todo } : null;
    }

}
```

Here, we do the same thing as the `getAll` method.
We return another instance of the same data to prevent direct overwrite.

However, you may have noticed that we do not cast the id as a string, because, in our model, we expect a number as an ID.
It's the responsibility of the caller to provide us the proper type.
In the controller, you may have also noticed that all the `id` that are sent to the service are cast as `Number`.



### Implement existById()

We can rely on our `findById` method and return a boolean value of the returned data, or we can rely on the `some` method.
Both methods are very similar in terms of performance, so no need to worry about it for now.

```javascript
class TodoService {

    /* ... */

    existById(id) {
        return Boolean(this.findById(id));
    }

    /* ... */

}
```

Or

```javascript
class TodoService {

    /* ... */

    existById(id) {
        return __(this).get('todos').some(({ id: todoId }) => {
            return todoId === id;
        });
    }

    /* ... */

}
```



### Implement updateById()

Now, let's update an existing todo.

```javascript
class TodoService {

    /* ... */

    updateById(id, { label, done }) {
        const todos = __(this).get('todos');
        const todo  = todos.find(({ id: todoId }) => {
            return todoId === id;
        });
    
        if (!todo) {
            throw new TypeError(`The todo ${id} was not found.`);
        }
    
        if (typeof label === 'string') {
            todo.label = label;
        }
    
        if (typeof done === 'boolean') {
            todo.done = done;
        }
    
        return { ...todo };
    }

    /* ... */

}
```

Here, first retrieve the original array, with all the original todo instances.

We attempt to find the todo with the received ID.
If it does not exist, we throw an error.
Notice that our controller made an `existById` check before going forward with the update.

Notice that we do not reassign the todo in the array.
Since the reference is still the same, the todo in the array is pointing to the same object as the `todo` constant.



### Implement deleteById()

Finally, let's delete a todo by ID.

```javascript
class TodoService {

    /* ... */

    deleteById(id) {
        const todos = __(this).get('todos');
        const index = todos.findIndex(({ id: todoId }) => {
            return todoId === id;
        });

        if (index === -1) {
            throw new TypeError(`The todo ${id} was not found.`);
        }

        todos.splice(index, 1);
    }

}
```

Here is our final class result.

```javascript
import __ from '@absolunet/private-registry';


class TodoService {

    init() {
        __(this).set('todos', []);
        __(this).set('id', 0);
    }

    getAll() {
        return __(this).get('todos').map((todo) => {
            return { ...todo };
        });
    }

    create({ label }) {
        const _this = __(this).get();
        const id = ++_this.id;

        const todo = {
            done: false,
            id,
            label
        };

        _this.todos.push(todo);

        return todo;
    }

    findById(id) {
        const todos = __(this).get('todos');

        const todo = todos.find(({ id: todoId }) => {
            return todoId === id;
        });

        return todo ? { ...todo } : null;
    }

    existById(id) {
        return __(this).get('todos').some(({ id: todoId }) => {
            return todoId === id;
        });
    }

    updateById(id, { label, done }) {
        const todos = __(this).get('todos');
        const todo  = todos.find(({ id: todoId }) => {
            return todoId === id;
        });

        if (!todo) {
            throw new TypeError(`The todo ${id} was not found.`);
        }

        if (typeof label === 'string') {
            todo.label = label;
        }

        if (typeof done === 'boolean') {
            todo.done = done;
        }

        return { ...todo };
    }

    deleteById(id) {
        const todos = __(this).get('todos');
        const index = todos.findIndex(({ id: todoId }) => {
            return todoId === id;
        });

        if (index === -1) {
            throw new TypeError(`The todo ${id} was not found.`);
        }

        todos.splice(index, 1);
    }

}


export default TodoService;
```
