# Validation

## Introduction

Validation is an essential part of any application.
Strong validator systems were developed over time, some even light enough for browsers, such as `yup`.
However, one of the strongest validation systems on the market is the popular [`@hapi/joi`](https://hapi.dev/family/joi/) validation package.
This package is being used for the `validator` service.



## The validator service

The `validator` service simply exposes the `@hapi/joi` package for direct usage.

```javascript
const validator = app.make('validator');

const schema = validator.object().keys({
    name: validator.string()
});

validator.assert({ name: 'John Smith' }, schema); // Everything went well!
validator.assert({ foo: 'bar' }, schema);
// ValidationError: {
//    "foo" [1]: "bar"
// }
//  
// [1] "foo" is not allowed
```

All the `@hapi/joi` package API is available in the `validator` service, including extensions through `extend`.



## Validate an HTTP request

The most common validation type in a server application is request validation.
Fortunately, Node IoC already wrapped the validator into a simple controller method.

```javascript
class MyController extends Controller {

    static get dependencies() {
        return ['custom.post.service'];
    }

    async store() {
        this.validate((v) => {
        	return {
        	    title:    v.string().min(3).required(),
                content:  v.string().required(),
                promoted: v.boolean().required()
            };
        });

        // After this point, we can consider the request's body to be valid.
        const { body: postData } = this.request;

        const post = await this.customPostService.createPost(postData);

        return this.json(post);
    }

}
```
