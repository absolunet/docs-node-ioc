# Test class

## Introduction

The test class in Node IoC is a way to enhance the test development experience.
All modern JavaScript test engines rely on callbacks, which is not very practical to organize code.

We can then use test classes to write our tests, à la PHPUnit.



## Test class

The test class always extends the application's `TestCase` base class, which extends from the framework's `TestCase` base class.
It allows you to centralize all common features and assertions in a single file.
The main difference between application classes and test classes is that they are written in CommonJS instead of ESM.
This prevents any unexpected test behavior and ensures that the environment has the most "vanilla" flavor.


```javascript
// test/TestCase.js

const { TestCase: BaseTestCase } = require('@absolunet/ioc');


class TestCase extends BaseTestCase {

    setResult(result) {
        this.result = result;
    }

    expectResultToBeFoo() {
        this.expect(this.result).toBe('foo');
    }

}


module.exports = TestCase;



// test/unit/SomeTest.js

const TestCase = require('../TestCase');


class SomeTest extends TestCase {

    testSomeKeyConfigurationShouldBeFoo() {
        this.expectResultToBeFoo(this.make('config').get('some.key'));   
    }

}


module.exports = SomeTest;
```

All of your test cases file names and class names should end with `Test`, such as `ExampleTest.js`.



### Define a test

To define a test, we would normally use a syntax like `test('Some description', () => { /* ... */ })`.
Instead, we can rely on method names.
All methods that start with `test` will be considered tests.
The description will then be the rest of the method's name, transformed as a sentence by the `helper.string` helper.

```javascript
class SomeTest extends TestCase {

    testSomeKeyConfigurationShouldBeFoo() {
        this.expectResultToBeFoo(this.make('config').get('some.key'));
        // Same result as:
        // test('Some key configuration should be foo', () => {
        //     expect(app.make('config').get('some.key')).toBe('foo');
        // })
    }
}
```

The defined test method, as shown above, will be transformed as a test statement in the engine.
It will also describe the test as part of a given namespace, which is represented by the test file location, and the file name itself.

For instance, the `test/unit/foo/bar/some/ClassTest.js` class file would be described as `Unit > Foo > Bar > Some`, and then by `Class`. If it has two test methods, `testSomething` and `testAnotherThing`, we would have the following output.

```
Unit > Foo > Bar > Some
  Class
    ✓ Something (12ms)
    ✓ Another thing (34ms)
```



## Setup and teardown

To define setup and teardown in a given class, we can rely on four methods that will be called by the test engine.

 - `beforeAll`
    > Will be called before all tests of the current class are run


 - `beforeEach`
    > Will be called before each test of the current class is run


 - `afterEach`
    > Will be called after each test of the current class has run


 - `afterAll`
    > Will be called after all tests of the current class has run


All of those hooks can be made `async` anytime, or return a `Promise`.



## Assertion

To make an assertion, you can use the `expect` method.

```javascript
class SomeTest extends TestCase {

    testSomething() {
        this.expect(true).toBe(true);
    }

}
```

For all your tests, the `app` property will be available to quickly create service instances to test them.
It is recommended to make the wanted services as fast as possible, such as in the `beforeEach` method.

To make something, you can also use the `make` helper method.

```javascript
const fakeRepository = require('./mocks/fakeRepository');

class SomeTest extends TestCase {

    beforeEach() {
        this.someService = this.make('some.service', {
            'some.repository': fakeRepository
        });
    }

    testSomething() {
       const result = this.someService.doSomething();
        this.expect(result).toBe('foo');
        this.expect(fakeRepository.get).toHaveBeenCalledTimes(1);
    }

}
```

If you need to expect a service to be bound, you can use the `expectBound`, or `expectNotBound` for the opposite behavior.

```javascript
class SomeTest extends TestCase {

    testSomething() {
        this.expectBound('config');
        this.expectNotBound('some.service');
    }

}
```
