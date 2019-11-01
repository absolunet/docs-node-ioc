# HTTP client

## Introduction

Making API calls to third parties is almost inevitable in modern Web applications. Configuring connectors may be very useful too when creating services that transact with other entities such as a CMS backend, an ERP, a SaaS or any other kind of parties. To make it easy to work with those parties, Node IoC provides an HTTP client service, powered by [Axios](https://github.com/axios/axios).



## The `http` service

To access the HTTP client, you can inject the `http` service, which will return a factoried Axios instance.
Then, all the available features in Axios will be directly available.

```javascript
const http = app.make('http');

const { data: first } = await http.get('https://example.com/foo/bar'); // { foo: "bar" }

const { data: second } = await http.post('https://example.com/foo/bar', { key: 'value' }); // { success: true }

const dedicatedClient = http.create({
    baseUrl: 'https://example.com'
});

http === dedicatedClient; // false

const { data: third } = await dedicatedClient.get('/foo/bar'); // { foo: "bar" }
```
