# Exception handling

## Introduction

To properly handle exceptions across the different contexts, such as CLI, Web and API requests, Node IoC made an exception handler that handles all those cases the proper way, besides logging the exceptions through the logger.

The bound exception handler is located in a Node IoC application.
It extends the framework's exception handler, so you can easily interact before or after different handling phases or completely override some handling phases.



## Lifecycle

In the lifecycle, the exception handler is used in three places: for the `unhandledRejection` event, the `uncaughtException` event and when catching an error that occurs during kernel handling.
You can find the exception handling in the `src/bootstrap/lifecycle.js` file.

The exception handler is also used in two places: the command runner and the HTTP handler.

Since a CLI request is handled by Yargs under the hood, we want to skip its error handler, which is not behaving the best possible way for Node IoC.
It overrides the Yargs exception handling by catching an error from within the handling process, so Yargs never notice it.
We then properly handle it, so the kernel can properly terminate the request.

For the HTTP exception handling, we cannot rely on the global kernel error catching since the whole process is trapped by Express to prevent unexpected exits.
The same thing happens here: the application's exception handler is called when an HTTP request error occurs, so the HTTP handler properly terminates the request.



## The handle method

The `handle` report is the one that should be called when an exception occurs.
By default, it stops the terminal interceptor capture to prevent a muted console, and to prevent unexpected console behavior.
Then, it reports the exception through the `report` method, and then render the exception through the `render` method.

When an exception is handled, it keeps the exception in memory.
It will then affect the `hadException` and `lastException` accessors.



## The report method

This method uses the logger service (`log`), if bound in the application, and reports the exception as an `error`.
If an error occurs while reporting, the reported error is rendered in the console, and the report does not occur.



## The render method

The `render` method simply chose between the `renderResponse` and `renderConsole` by checking the received `response` object.
To render a response, the `response` object must be truthy and expose the `write`, `json` and `status` methods.



### Render in console

When rendering in the console, the exception handler uses the `console` driver.
By default, the `console` driver is the `prettyError` driver, which uses the `terminal` service to echo the formatted error.

The formatting is handled by the [`pretty-error`](https://github.com/AriaMinaei/pretty-error) package.
The style from the `terminal` service is automatically transferred to the `pretty-error` instance.



### Render in HTTP response

When rendering in the HTTP response, it starts by setting the response status based on the thrown exception.
By default, the `500 Internal Server Error.` status is sent if no `status` property was provided in the exception instance.
The status must be an integer, such as `404`.

Then, the `app.debug` configuration value is checked to use the most appropriate driver.
If set to `true`, the `http.debug` driver is used, aliased by the `ouch` driver.
This driver uses the [`ouch`](https://github.com/quorrajs/Ouch) package, which is similar to the popular PHP's [Whoops](https://github.com/filp/whoops) package.
Otherwise, the `http.production` driver is used, aliased by the `view` driver.



#### HTML response

When rendering HTML response, the Ouch's PrettyPageHandler is used to render the page, with the blue theme.

To enhance your development experience, Ouch supports IDE links from the stack files.
You must, however, specify your own IDE in the `dev.ide` configuration.



#### JSON response

If the request accepts `application/json` or contains the `x-requested-with: xmlhtttprequest` header (case-insensitive), the response will be formatted as JSON instead.
The Ouch's JsonResponseHandler is then used to process the JSON response.

The schema will look like this.

```json
{
  "error": {
    "file": "/path/to/error/File.js",
    "line": 123,
    "message": "Internal Server Error.",
    "trace": [
      {
        "class": "File",
        "file": "/path/to/error/File.js",
        "function": "methodThatThrows",
        "line": 123
      },
      {
        "class": "File",
        "file": "/path/to/error/File.js",
        "function": "callMethodThatThrows",
        "line": 98
      }
    ],
    "type": "TypeError"
  }
}
```



## Handle error in production

When in production, errors must be well handled to prevent unexpected rendered pages or data.

Console errors remain the same since we can normally assume that a developer will use the CLI, or will handle the error if using it through an application of his own.

However, HTTP errors must be well handled for users, without stack trace or frames.
HTML response can be easily customized through the `errors` views.

By default, the application offers the `resources/view/errors/base.html` template that you can extend to display custom error pages.
The HTTP status code is used to render the appropriate view.
For instance, a `404 Not Found.` error will attempt to render the `errors.404` view.
The `errors.generic` view is used by default if the current error code cannot be found.
If the `errors.generic` view cannot be found, a simple `Something went wrong...` text is rendered.
If the `translator` service is available, it will use it to translate the default text, such as `Quelque chose a mal tourné...` in french.
