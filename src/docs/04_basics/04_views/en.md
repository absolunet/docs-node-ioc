# Views

## Introduction

Views are the entry point for front-end development. It allows to render HTML pages in an organized, composable and programmatic way, inject dynamic data in your pages from the back-end, prepare the field for a single-pag application, and so on. Node IoC have made it easy to play with views by building a configurable and extendable view factory that relies by default on [JSRender](https://www.jsviews.com) template engine. If you feel the need to work with another template system, such as Pug, or more dynamic and modern engines such as React or Vue.js, feel free to create the appropriate driver in a Node IoC package.



## View files

In a default Node IoC application, the views are located under the `resources/views` folder. Everything in this folder can be moved, manipulates, deleted, whatever suits you the best. The only views that should not move is the `errors` views (if you do, it will not break anything, but you will lose some exception handling features).

The original structure proposes directories that separate the view concerns. The `layouts` folder contains everything you need to quickly scaffold any page with a default template containing all the basic HTML tags, your head, CSS and JavaScript files, title, meta tags, etc. The `pages` views use the layout by extending it and inserting content in the `slot`. We will go deeper in this concept. Like said before, feel free to move the structure to match your needs.



## Making a view

To render a view file, the `view` factory service was created for this purpose. It exposes a `make` method that accepts two arguments: the view name to render, and a view-model object, or `props` if you will.

```javascript
const renderedView = app.make('view').make('pages.hello', { heading: 'Hello world' });
// typeof renderedView === "string"
```

This method will call the `view.resolver` to find the `pages.hello` view, retrieve its path, then render it with the `view.engine` with the view-model, if given, and return the result.



### View name

The view name must match the view file path from the views folder, with dot-separated segments, and without the file extension.

If the wanted view file is `resources/views/pages/foo/bar.html`, then its name should be `pages.foo.bar`.



### Namespace

Some packages may offer some "private" templates that will not be part of your application files. Since all your views should have priority for names and prevent package of registering a `pages` folder, then making your own `pages` not renderable, a namespace system was built within the `view.resolver` service.

To register a namespace, simply use the `namespace` method in the `view.resolver` service.

```javascript
app.make('view.resolver').namespace('home', app.homePath('ioc', 'views'));
```

Then, a view in this namespace can be rendered by using the `namespace::view.name` syntax.

Given the `~/ioc/views/pages/foo/bar.html` file, we would render it with `home::pages.foo.bar` name. That will prevent conflict between your application pages and the home directory pages.



## JSRender engine

### Tags

By default, JSRender offers some tags, such as `{{:}}`, `{{if}}`, `{{for}}`, `{{include}}` and so on. They are all still valid. However, the `include` tag just did not suit the Node IoC ecosystem, so it was refactored.



#### The echo tags

To print values in your views, JSRender offers the `{{: ...}}` and `{{> ...}}` tags.

Given the view-model object `{ heading: 'This is a <strong>huge</strong> news' }`, you can print the headings with both tags.

`{{:heading}}` will result in "this is a **huge** news".

`{{>heading}}` will result in "this is a \<strong\>huge\</strong\> news".



#### The `include` tag

To include another template, the `include` exists in the JSRender engine, but refactored by Node IoC.

```html
{{include name="components.grid.cell"}}
    <article>
        {{include name="components.user.avatar" data=author /}}
        {{include name="components.user.name" data=author /}}
        {{include name="components.news.full data=#data /}}
    </article>
{{/include}}
```

It accepts four arguments, which three of them are optional.

 - `name`: Required. The view name to render.
 - `data`: Optional. The view-model object to be sent in the view. The `#data` variable represents the current context's view-model
 - `inline`: Optional. Flag that indicates to render the whole view without line return. Useful when you need to pass some HTML segments in a JavaScript string.
 - `escape`: Optional. Will escape the `\` character.

It can be included in two different ways. If the tag ends with a slash, such as the three `include` tags in the article, in the above example, the tag will be replaced by a rendered version of the view. However, if it has a closing tag, such as the `components.grid.cell` that wraps the content, the content inside the tag will be passed to the included view as the `slot`. It is very useful to extend views, such as the main layout, or for components that may receive content.

if you are building a component that should accept content, the `{{:slot}}` statement can be used anywhere to insert the content. You can even use this statement more than once if you need.



### Helpers

A JSRender helper is a function that can be used anywhere in any template with the given syntax: `~myHelper()`, prefixed by a tilde. They act as functions that are defined by the JSRender view driver.



#### The `inject` helper

If you need, in any case, to get an injectable in your view, the `inject` helper may be very useful. It acts the same way as `app.make()`.

```html
{{if ~inject('app').environment === 'local'}}
    <p>You are in a local environment</p>
{{/if}}
```



#### The `config` helper

Sometimes, configuration are used by all templates. To prevent sending the same view-model over and over again, you can quickly access the configuration from the `config` helper.

```html
<p>Welcome to {{:~config('app.name')}}</p>
```



#### The `route` helper

Instead of inserting manual links in your views, the `route` helper may be used to resolve a route URL by name and parameters.

Given the `router.get('/foo/:bar','FooBarController@action').name('foo.bar')` route, here is how we could use the `route` helper. 

```html
<a href="{{:~route('foo.bar', { 'bar': 'the-bar-slug' })}}">Link to the bar</a>
```

Notice that the parameters object keys are wrapped by quotes. It is mandatory for JSRender. Otherwise, it is going to interpret the key as a variable, such as `{ [bar]: 'the-bar-slug' }` would normally do in JavaScript.

The parameters object is optional. It is only required if the route URI has parameters.



#### The `t` helper

The `t` helpers stands for `translate`. A lot of framework use `t()`, `trans()`, `__()` and `translate()`. The choice of the `t` name was mainly for simplicity when translating content.

```html
<p>{{:~t('This is some content that need to be translated')}}</p>
<p>{{:~t('some.translation.key'}}</p>
```



#### The `dump` helper

In a controller, you can easily dump variables with the `return this.dump(variable)` statement. However, it may be very useful to dump data while rendering template, because the context of a template differs a lot from a basic JavaScript class context.

You can dump any value you want, anywhere you want. It will simply inject a dump area in your view, without blocking the view rendering.


```html
<div>
{{for items}}
    {{:~dump(#data)}}
{{/for}}
</div>
```

In this example, for three items, there will be three dumping areas, each time containing the current item in the loop (`#data` is the context variable in JSRender, so it changes depending on the rendering scope)
