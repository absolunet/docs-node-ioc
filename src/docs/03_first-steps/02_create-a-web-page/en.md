# Create a Web page

## Introduction

This tutorial will show you how to build a Web page using MVC approach with Node IoC.

For this second assignment, we will create a search form to find an inspiring book with the [Google Books API](https://developers.google.com/books/docs/v1/using#PerformingSearch). The fetch logic will be the same, but the implementation will be different since it will display a Web page instead of a formatted string inside the console.

Here are the key concepts that will be part of this tutorial:

 - The `serve` command
 - The `router` service (through the routes file and a view helper function)
 - The web routes file
 - Named routes
 - The `Controller` class
 - Scaffolding controller with `make:controller`
 - The `http` service
 - The `view` service (through a controller method)
 - The `include` view tag
 - The `dumper` service (through a controller method and a view helper function)
 - The `translator` service (through a view helper function)
 - The translations file



## Launch the server

First, we need to start a server.

```bash
node ioc serve
```

This will start a new server process over port `8080`. Try accessing [http://localhost:8080](). You should see the default Web welcome page. If you need to change port, use the `--port=8080` option, with the wanted port.

To develop faster, Node IoC provides a daemon feature that will relaunch the server on file change.

```bash
node ioc serve --daemon
```

Once the server has started, we can, in another terminal, run the Node Manager `watch` command.

```bash
npm run manager:watch
```

Now, we are ready to create our first Web page!



## Create the routes

Then, we need to create our routes. A route is a way to associate a path or a pattern to a handler. In an MVC application, the handler will be a controller action.

Your routes are located in the `src/routes/web.js` file.

```javascript
export default (router, app) => {
    // The original comments were stripped out for easier readability.

    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');

    router.static('/static', app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};
```

Let's create a route that will match the `/inspire/book` URL.

```javascript
export default (router, app) => {
    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');

    // Your new route
    router.get('/inspire/book', (request, response) => {
        response.send('The inspire book search page...');
    });

    router.static('/static', app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};
```

Try the newly created page: [http://localhost:8080/inspire/book]().

You should only see a text in a blank window, with your text: `The inspire book search page...`.

You can also create the result page route.

```javascript
router.get('/inspire/book/search', (request, response) => {
    response.send('The inspire book search result page...');
});
```



## Creat the controller

Now, let's do the things right! A closure is a fast way to implement a route, but the code will rapidly begin to be messy, and the routes file, huge. We need to split the code by responsibility.

A controller has the responsibility to handle a request, and a route, to map URL patterns to a request handler.

To create a controller, you can use the Node IoC command to make a quick scaffold.

```bash
node ioc make:controller InspireBookController
```

> This scaffold command accepts some flags to create different skeletons.
>
> the `handler` flag will create a controller with a single `handle` method.
>
> The `resource` flag will create a controller with all the CRUD methods: `index`, `create`, `store`, `show`, `edit`, `update` and `destroy`.
>
> The `api` flag will create a controller with all the API CRUD methods: `index`, `store`, `show`, `update` and `destroy`.

Your new controller is located under the `src/app/http/controllers` folder.

Now, inside your controller, you can create your first method. Let's call it `index`.

```javascript
class InspireBookController extends Controller {

    index() {
        this.response.send('The inspire book search result page inside a controller...');
    }

}
```

Then, we must link it to the route.

```javascript
export default (router, app) => {
    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');

    // Your updated route, following 'ControllerName@method' pattern
    router.get('/inspire/book', 'InspireBookController@index');
 
    // Your search route, still with a closure handler
    router.get('/inspire/book/search', (request, response) => {
        response.send('The inspire book search result page...');
    });
 
    router.static('/static',  app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};
```

A thing that must be understood about the controller resolving is that, normally, we must register a controller through the controller repository (`router.controller`). However, the application controllers are dynamically resolved by the repository, so you don't have to manually register all of them.

The pattern of a controller for resolving is `folder.subfolder.ControllerName@method`, starting from the `src/app/controllers` folder.

Now, let's reload our Web page again, with the same URL. The request should now be handled by the controller, through the `index` method.



## Render the index view

The view system is already attached to the controller instance. You can use the `view` method to display an rendered template.

> The same way the controller names are dotted-separated paths to the file from the controllers folder, the views uses the same approach.
>
> Starting from the `resources/views` folder, the view `pages.home` should be located at `resources/views/pages/home.html`.

First, let's try to render an existing template, the `pages.home` view.

```javascript
class InspireBookController extends Controller {

    index() {
        return this.view('pages.home');
    }

}
```

Now, the `/inspire/book` page should display the same page as the home page.

Let's define our own page template.

Inside `resources/views/pages`, we will create a folder called `inspire`, and inside of it, a `book` folder. The views organization is your to implement when building your own website. We will keep it simple and URL-related for now, so you won't get lost through this assignment. Feel free to explore the best ways to organize your application.

Now, inside the `resources/views/pages/inspire/book`, we will create the template, `index.html`.

Here is a suggested content:

```html
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x text-center align-middle">
        <div class="cell medium-8 medium-offset-2 large-6 large-offset-3">
            <h2 class="margin-top-3">{{:~t('Search an inspiring book')}}.</h2>
            <form action="/inspire/book/search">
                <label>
                    Search
                    <input type="search" name="book" placeholder="{{:~t('What do you want to read?')}}">
                </label>
                <input type="submit" class="button" value="{{:~t('Find something inspiring!')}}">
            </form>
        </div>
    </div>
</div>
{{/include}}
```

Let's render this view.

```javascript
class InspireBookController extends Controller {

    index() {
        return this.view('pages.inspire.book.index');
    }

}
```

You should see the search form now!

Node IoC provides Foundation 6 as a starting point to build your website. Feel free to change to whatever you prefer.

The default rendering engine is [JSRender](https://www.jsviews.com/).
Some tags and helpers are added by default by the `view.engine` service.



### the `include` tag

The `{{include}}` tag indicates to load another view. It needs a view `name` (the same dotted syntax previously used), at least, and an optional `data` object. If you need to pass the current data to the sub-view, use `data=#data`.

In this case, `{{include name="layouts.app"}}` loads the application layout template.

If the template contains a `{{:slot}}` instruction, it means that you can insert HTML in it. It will be rendered at this precise spot.

Inside the application layout slot, we print the page main HTML content.



### The `t()` helper function
The `{{:~t('some text)}}` instruction prints the given text, but transformed by the `translator` service. If a translation exists for the current locale, it will returns the translated string. Otherwise, the original string is returned.



## Perform the search

Now that we made our first web page, let's perform a search.

First, we need to change the second route handler to point to our controller. Let's use the `search` action method

```javascript
// src/routes/web.js
export default (router, app) => {
    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');
 
    router.get('/inspire/book',        'InspireBookController@index');
    router.get('/inspire/book/search', 'InspireBookController@search');
    
    router.static('/static',  app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};

// src/app/http/controllers/InspireBookController.js
class InspireBookController extends Controller {

    index() {
        return this.view('pages.inspire.book.index');
    }

    search() {
        return this.response.send('Searching an inspiring book...');
    }

}
```

Now, try to submit your form. You should see your `Searching an inspiring book...` text. Now, the routing is completely done. We just need to actually perform a search and render it.



### Use a route name instead of an URL

We succeeded in sending a search request from a page to a route. However, let's already use the good practice.

We should not rely on route URL since they can easily change, and it would be a mess to maintain.

The router supports route naming to make it easier to retrieve them in a more standardized way.


```javascript
export default (router, app) => {
    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');
    
    router.get('/inspire/book',        'InspireBookController@index').name('inspire.book.index');
    router.get('/inspire/book/search', 'InspireBookController@search').name('inspire.book.search');
    
    router.static('/static',  app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};
```



#### The `route` helper function

Once the routes are named, we can replace the hard-coded URL in the form with the `route` helper function.

```html
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x text-center align-middle">
        <div class="cell medium-8 medium-offset-2 large-6 large-offset-3">
            <h2 class="margin-top-3">{{:~t('Search an inspiring book')}}.</h2>
            <form action="{{:~route('inspire.book.search')}}">
                <label>
                    Search
                    <input type="search" name="query" placeholder="{{:~t('What do you want to read?')}}">
                </label>
                <input type="submit" class="button" value="{{:~t('Find something inspiring!')}}">
            </form>
        </div>
    </div>
</div>
{{/include}}
```

When reloading the page, the URL in the form should be the same as it was before. The main advantage is that you can now rename your URL without refactor your whole templates that are possibly using this route URL.



### Retrieve the request query

We first need to retrieve the `book` parameter sent by the form.

You can simply use the `request` object bind to the controller. It exposes a `query` property, which represent all the query string parameters. Then, we can retrieve the `book` value inside the request query.

```javascript
class InspireBookController extends Controller {

    index() {
        return this.view('pages.inspire.book.index');
    }

    search() {
        return this.response.send(`You are searching for "${this.request.query.book}".`);
    }

}
```

If you submitted the form with `react`, you should see `You are searching for "react".`. We have correctly retrieved our parameter.



### Search in the Google Book API

Now, we need to perform a search in the [Google Book API](https://developers.google.com/books/docs/v1/using#PerformingSearc).

If you already did the _Create a command_ assignment, there is nothing new here. We first inject the `http` service, we make our action async, then we await for the HTTP call response to finally retrieve a random book.


```javascript
class InspireBookController extends Controller {

    static get dependencies() {
        return ['http'];
    }

    index() {
        return this.view('pages.inspire.book.index');
    }

    async search() {
        const { book: query } = this.request.query;

        const { data: { items: books } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: query
            }
        });
    
        const book = books.sort(() => {
            return Math.random() - 0.5;
        }).shift();
    
        return this.response.send(`You are searching for "${query}".`);
    }

}
```

In Node.js, or any CLI application, it's a reflex to print the received data in the console. We can also launch the engine debugger, if available, to put some break points.
However, for front-end developers, it is mode intuitive to use the browser console such as the Chrome DevTool Console or Firebug. It is still possible to launch node in inspect mode, but may still be complicated to use if not properly configured.

Fortunately, Node IoC provides a simple service to quickly inspect some data in the browser or in the console, called `dumper`.
It is based on the [Symfony VarDumper](https://symfony.com/doc/current/components/var_dumper.html#dump-examples-and-output) project.
It allows to use a JSON-tree lookalike system to inspect the dumped data.
The base controller offers it out of the box.

Let's use it!

```javascript
class InspireBookController extends Controller {

    /* ... */

    async search() {
        const { book: query } = this.request.query;

        const { data: { items: books } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: query
            }
        });

        const book = books.sort(() => {
            return Math.random() - 0.5;
        }).shift();

        return this.dump(book);

        // return this.response.send(`You are searching for "${query}".`);
    }

}
```

If you reload the page, you should see a page filled by the book data. You will retrieve the dump location (the link is clickable and opens the compiled file in your configured IDE) and the dumped data.

If you click on arrows, you will be able to inspect the nested objects and array values.

> The dumper is themeable through the `dev.dumper` configuration.
>
> Feel free to create your own theme!



## Render the search result view

Now that we have a nice view on our model, let's render a web page with the data.

```javascript
class InspireBookController extends Controller {

    /* ... */

    async search() {
        const { book: query } = this.request.query;

        const { data: { items: books } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: query
            }
        });

        const book = books.sort(() => {
            return Math.random() - 0.5;
        }).shift();

        return this.view('pages.inspire.book.search', { query, book });
    }

}
```

We first start by returning a rendered view with previously computed data: the current book search query, and the inspiring book. In order to render the view, we need to create a view that matches the requested one.

We will create a view under `resources/views/pages/inspire/book` called `search.html`. Here is the basic template that should be rendered (feel free to customize it your own way).

```html
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x">
        <div class="cell">
            {{:~dump(#data)}}
        </div>
    </div>
</div>
{{/include}}
```



### The `dump` helper function

Notices the `{{:~dump(#data)}}` statement? This acts the same as the controller's `this.dump(data)`. However, it outputs the data inside the template instead of displaying a complete web page filled with the dumped value.

You should see two keys inside the `#data` object: `book` (an object), and `query` (a string containing the searched book). This helper is very useful.



### Display the view-model data in the view

Now that we know the data that we have, let's put it together in a simple Web page.

```html
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x">
        <div class="cell margin-top-2">
            <h1>{{:~t('Search result for:')}} "<em>{{:query}}</em>"</h1>
        </div>
        <div class="cell margin-top-1">
            <div class="media-object stack-for-small">
                <div class="media-object-section">
                    <div class="card text-center">
                        <div class="card-section separator-center">
                            <div class="thumbnail">
                                <img src="{{:book.volumeInfo.imageLinks.thumbnail}}">
                            </div>
                        </div>
                        <div class="card-section padding-top-0">
                            <a href="{{:book.volumeInfo.infoLink}}" target="_blank" class="button margin-top-1">{{:~t('View on Google Books')}}</a>
                        </div>
                    </div>
                </div>
                <div class="media-object-section main-section">
                    <h2 class="h3">{{:book.volumeInfo.title}}</h2>
                    {{if book.volumeInfo.subtitle}}
                    <h3 class="h5 subheader">{{:book.volumeInfo.subtitle}}</h3>
                    {{/if}}
                    <p class="subheader">{{:~t('Author', book.volumeInfo.authors.length)}}</p>
                    <ul class="no-bullet margin-left-2 margin-bottom-2">
                        {{for book.volumeInfo.authors}}
                        <li>{{:#data}}</li>
                        {{/for}}
                    </ul>
                    <p>{{:book.volumeInfo.description}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
{{/include}}
```

Let's examine the things that happened here.

First, we printed the current searched query in the page title.

We use the `t` translation helper function to internationalize our page.

Then, we printed some information about the current book. We create an image tag with the thumbnail as the source.

We also added a link button to the Google Books page.

On the other portion of the page we basically printed the minimalist information about the book: title, subtitle (if it exists), author(s) and description.

For the author, we made a `for` loop to print all the names.



### Pluralization and translation

Something that we did not covered yet was the pluralization, which is part of the framework, within a standalone helper, but also within the translator service, which we use through the `t` helper function.

Then `t` function can accept multiple kind of parameters:

 - `t('my.string')` -> basic translation
 - `t('my.string', 2)` -> basic translation with pluralization
 - `t('my.string', { foo: 'bar' })` -> translation with placeholder replacement
 - `t('my.string', { foo: 'bar' }, 2)` -> translation with placeholder replacement and pluralization
 
 Unlike the `helper.string`'s `pluralize` method, the pluralization of a translation is not magic. It rely on translation configuration.
 
 In our case, we used the following statement: `t('Author', book.volumeInfo.authors.length`, which basically say that the word should be translated, and also pluralize if there are more than one author. If the value is `>= 1`, the the plural version, if it exists, will be used. Since no translation were made yet, we see `Author` as an output instead of `Authors` when we see more than one result.

Let's make our first pluralizable translation!

In the `resources/lang`, you should see a `translations.yaml` file. This file is used by default when the translation does not have any namespace (we will cover this in another section).

Let's add an entry.

```yaml
# Custom translations

Author:
    en:
      - Author
      - Authors
    fr: # Pour nos collègues francophones ;)
      - Auteur
      - Auteurs
```

What this entry do is this:

 - For a single value, the `Author` translation, in english, will be `Author`.
 - For a plural value, the `Author` translation, in english, will be `Authors`.

Now, for multiple authors, we should see `Authors` instead of `Author`.

Here is the final result for the routes file, the controller, the two templates and the translations file:

```javascript
// src/routes/web.js
export default (router, app) => {
    router.get('/',        'HomeController@index').name('home');
    router.get('/example', 'HomeController@example').name('example');

    router.get('/inspire/book',        'InspireBookController@index').name('inspire.book.index');
    router.get('/inspire/book/search', 'InspireBookController@search').name('inspire.book.search');

    router.static('/static',  app.publicPath());
    router.static('/uploads', app.uploadPath('public'));
};
```

```javascript
// src/app/http/controllers/InspireBookController.js
import Controller from './Controller';


class InspireBookController extends Controller {

    static get dependencies() {
        return ['http'];
    }

    index() {
        return this.view('pages.inspire.book.index');
    }

    async search() {
        const { query } = this.request.query;

        const { data: { items: books } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: query
            }
        });

        const book = books.sort(() => {
            return Math.random() - 0.5;
        }).shift();

        return this.view('pages.inspire.book.search', { book, query });
    }

}


export default InspireBookController;
```

```html
<!-- resources/views/pages/inspire/book/index.html -->
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x text-center align-middle">
        <div class="cell medium-8 medium-offset-2 large-6 large-offset-3">
            <h2 class="margin-top-3">{{:~t('Search an inspiring book')}}.</h2>
            <form action="{{:~route('inspire.book.search')}}">
                <label>
                    Search
                    <input type="search" name="query" placeholder="{{:~t('What do you want to read?')}}">
                </label>
                <input type="submit" class="button" value="{{:~t('Find something inspiring!')}}">
            </form>
        </div>
    </div>
</div>
{{/include}}
```

```html
<!-- resources/views/pages/inspire/book/search.html -->
{{include name="layouts.app"}}
<div class="grid-container">
    <div class="grid-x">
        <div class="cell margin-top-2">
            <h1>{{:~t('Search result for:')}} "<em>{{:query}}</em>"</h1>
        </div>
        <div class="cell margin-top-1">
            <div class="media-object stack-for-small">
                <div class="media-object-section">
                    <div class="card text-center">
                        <div class="card-section separator-center">
                            <div class="thumbnail">
                                <img src="{{:book.volumeInfo.imageLinks.thumbnail}}">
                            </div>
                        </div>
                        <div class="card-section padding-top-0">
                            <a href="{{:book.volumeInfo.infoLink}}" target="_blank" class="button margin-top-1">{{:~t('View on Google Books')}}</a>
                        </div>
                    </div>
                </div>
                <div class="media-object-section main-section">
                    <h2 class="h3">{{:book.volumeInfo.title}}</h2>
                    {{if book.volumeInfo.subtitle}}
                    <h3 class="h5 subheader">{{:book.volumeInfo.subtitle}}</h3>
                    {{/if}}
                    <p class="subheader">{{:~t('Author', book.volumeInfo.authors.length)}}</p>
                    <ul class="no-bullet margin-left-2 margin-bottom-2">
                        {{for book.volumeInfo.authors}}
                        <li>{{:#data}}</li>
                        {{/for}}
                    </ul>
                    <p>{{:book.volumeInfo.description}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
{{/include}}
```

```yaml
# resources/lang/translations.yaml
Example page:
  en: Example page
  fr: Page d'exemple

Hello world:
  en: Hello world
  fr: Bonjour le monde

This is an example page:
  en: This is an example page
  fr: Ceci est une page d'exemple

Welcome:
  en: Welcome
  fr: Bienvenue

/create:
  en: /create
  fr: /creer

/edit:
  en: /edit
  fr: /editer


# Custom translations

Author:
  en:
    - Author
    - Authors
  fr: # Pour nos collègues francophones ;)
    - Auteur
    - Auteurs
```
