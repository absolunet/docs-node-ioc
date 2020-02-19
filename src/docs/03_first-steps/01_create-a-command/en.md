# Create a command

## Introduction

In this first of four first step tutorials, you will create your first CLI command.

For this first assignment, we will build a command that will display a book suggestion related to a given query through the [Google Books API](https://developers.google.com/books/docs/v1/using#PerformingSearch).

Here are the key concepts that will be part of this tutorial:

 - The `Command` class
 - Scaffolding command with `make:command`
 - The `http` service
 - The `terminal` service (through the command methods)
 

```
node ioc inspire:book react

Fullstack React
The Complete Guide to ReactJS and Friends
By Accomazzo Anthony, Accomazzo Anthony and Ari Lerner
Published date: 2017-03
Ebook: http://books.google.ca/books?id=ppjUtAEACAAJ&dq=react&hl=&source=gbs_api
```



## Create the command class file

First, we need a command class file.
Node IoC offers you a command to create a command scaffold.

```bash
node ioc make:command InspireBookCommand
```

This will create a file named `InspireBookCommand.js` under the `src/app/commands` folder.
Now that the file has been created, we need to test that it is correctly bootstrapped by the kernel.
We need to compile our code.

```bash
npm run manager:build
```

Once the code is fully compiled by the Manager, run `node ioc` command, you should see a new command called `name:command` in the list.
Let's try it out!

```bash
node ioc name:command
```

You should see a console message indicating `To be implemented...`.

From now on, we will not need to create new files, so you can use the Manager watch command to compile files on save.

```bash
npm run manager:watch
```



## Fill command metadata

Once that the command has been created, we need to properly fill metadata, such as the name, the description, etc.

First, we need to change the generic command name.
Let's name it `inspire:book`.
Second, let's adjust the command description.
How about `Find an inspiring book that matches your needs`?

```javascript
class InspireBookCommand extends Command {

    /* ... */

    get name() {
        return 'inspire:book';
    }

    get description() {
        return 'Find an inspiring book that matches your needs.';    
    }

    /* ... */

}
```

Now, if you run `node ioc`, you should see your new command name, followed by its new description.
If it's still the old name, don't forget to compile your code!



## Describe arguments

After this, if you take a look above on the expected result, we need to handle an argument.
In the example, the argument is a `parameter`, its value is `react`.

> A **parameter** is a value that follows the command, without the `--` prefix, such as `name:command parameter`.
>
> An **option** is a value that follows an option name, such as `name:command --option=value`.
>
> A **flag** is a boolean status that is set to `true` when present, such as `name:command --flag`.

To be able to receive a parameter, we need to specify it in the command through the `parameters` accessor.

It should return a two-dimensional array of `Parameter` arguments, which are, in order, `[name, isRequired, defaultValue, description]`.

```javascript
class InspireBookCommand extends Command {

    /* ... */

    get parameters() {
        return [
            ['book', true, null, 'The book you are searching for.']
        ];
    }

    /* ... */

}
```

Now, you can inspect the command signature through the `--help` flag.

```
node ioc inspire:book --help

ioc inspire:book <book>

Find an inspiring book that matches your needs.

Options:
  --help         Show help                            [boolean]
  --version      Show version number                  [boolean]
  -v, --verbose  Adjust the verbosity of the command    [count]
```

We can see that the `book` parameter is now handled by the console engine.

Now, let's try to retrieve the parameter value in the `handle` method.
You can do it with the `parameter` method.
It needs the parameter name as the only argument.

```javascript
class InspireBookCommand extends Command {

    /* ... */

    get parameters() {
        return [
            ['book', true, null, 'The book you are searching for.']
        ];
    }

    handle() {
        this.info(this.parameter('book'));
    }

}
```

When running `node ioc inspire:book react`, you should see `react` logged back in the console.



## Inject the http service

Now, we have all we need to consume the [Google Books API](https://developers.google.com/books/docs/v1/using#PerformingSearch).
To consume it, we need the `http` service, which allows us to make HTTP calls.

```javascript
class InspireBookCommand extends Command {

    static get dependencies() {
        return ['http'];
    }

    get name() {
        return 'inspire:book';
    }

    get description() {
        return 'Find an inspiring book that matches your needs.';    
    }

    get parameters() {
        return [
            ['book', true, null, 'The book you are searching for.']
        ];
    }

    handle() {
        this.info(this.parameter('book'));
    }

}
```

The `http` service now bound to your class, you can use `this.http.get(url, config)`.



## Make the API call

Now, we need to make an API call to Google Books.
Since an API call takes time, we need to switch to `async` mode.
Simply use the `async` keyword before the `handle` method to make it async.
At the same time, let's make our API call.

```javascript
class InspireBookCommand extends Command {

    /* ... */

    async handle() {
    	const { data: { items } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
    	    params: {
    	    	q: this.parameter('book')
    	    }
        });

        this.write(items.length); // It should print 10, the default pagination size.
    }

}
```

Now that we made our API call, to inspire the user, we need to pick a random item.

```javascript
class InspireBookCommand extends Command {

    /* ... */

    async handle() {
    	const { data: { items } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
    	    params: {
    	    	q: this.parameter('book')
    	    }
        });

        const item = items.sort(() => {
            return Math.random() - 0.5;
        }).shift();

        this.write(item); // You should have the book model from the Google API.
    }

}
```



## Format the output

We now have everything we need to display that inspiring book to the user.
We just need to format the final output.

```javascript
class InspireBookCommand extends Command {

    /* ... */

    async handle() {
        const { data: { items: books } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: this.parameter('book')
            }
        });

        const [{ volumeInfo: { authors, infoLink, publishedDate, subtitle, title  } }] = books.sort(() => {
            return Math.random() - 0.5;
        });

        const lastAuthor = authors.pop();
        const formattedAuthors = `${authors.length > 0 ? `${authors.join(', ')} and ` : ''}${lastAuthor}`;

        let output = `\n${title}\n`;

        if (subtitle) {
            output += `${subtitle}\n`;
        }

        output += `By ${formattedAuthors}\n`;
        output += `Published date: ${publishedDate}\n`;
        output += `Ebook: ${infoLink}`;

        this.info(output);
    }

}
```

Here is the final result with enhanced structure:

```javascript
import { Command } from '@absolunet/ioc';


class InspireBookCommand extends Command {

    static get dependencies() {
        return ['http'];
    }

    get name() {
        return 'inspire:book';
    }

    get description() {
        return 'Find an inspiring book that matches your needs.';
    }

    get parameters() {
        return [
            ['book', true, null, 'The book you are searching for.']
        ];
    }

    async handle() {
        const book = await this.loadRandomBook();

        this.info(this.getFormattedBookInfo(book));
    }

    async loadRandomBook() {
        const { data: { items } } = await this.http.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: this.parameter('book')
            }
        });

        return items.sort(() => {
            return Math.random() - 0.5;
        }).shift();
    }

    getFormattedBookInformation({ volumeInfo: { authors, infoLink, publishedDate, subtitle, title } }) {
        const lastAuthor = authors.pop();
        const formattedAuthors = `${authors.length > 0 ? `${authors.join(', ')} and ` : ''}${lastAuthor}`;

        const information = [
        	title,
            subtitle,
            `By ${formattedAuthors}`,
            `Published date: ${publishedDate}`,
            `Ebook: ${infoLink}`
        ];

        return information.filter(Boolean).join('\n');
    }

}


export default InspireBookCommand;
```
