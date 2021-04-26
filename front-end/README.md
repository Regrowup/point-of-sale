# PoS frontend

This is a [ReactJS](https://facebook.github.io/react/) [SPA](https://en.wikipedia.org/wiki/Single-page_application), using [React Router](https://github.com/ReactTraining/react-router) for URL management and [Redux](https://github.com/reduxjs/react-redux) for state management. The backend (API) for this application lives in another folder: https://github.com/chipit24/point-of-sale/back-end.

 - [Getting started](#getting-started)
 - [Running E2E tests](#running-e2e-tests)

## Getting started

Follow the steps below to get the application running locally:

1. Clone the repository and `cd` into it:
   ```console
   $ git clone git@github.com:chipit24/point-of-sale.git
   $ cd point-of-sale/front-end
   ```
2. Run `npm i` to install all dependencies, and `npm start` to start the [webpack dev server](https://github.com/webpack/webpack-dev-server):
    ```console
    $ npm i
    $ npm start
    ```
3. Visit https://github.com/chipit24/point-of-sale/back-end to set up the API server if you have not already done so, then continue with step 4 below.
4. Visit `http://localhost:8080` in your browser to see the app. If port `8080` is already being used for another application, then the webpack dev server will assign another port. Look at the console output to determine the correct URL to visit.

## Running E2E tests

Integration / end-to-end (e2e) tests are defined in the `cypress/integration` folder, and are run using the `cypress:open` command.

The cypress tests execute the following command to configure the test database: `cd ../back-end && php artisan migrate:fresh --seed --env testing`. Because of this, it is important to ensure the backend server is set up with a test database in the `back-end` directory. Also ensure the API is running by executing the following command in the `back-end` folder: `php artisan serve --env testing`.

Start the webpack dev server, and in another tab / process, start Cypress:
```console
$ npm start
$ npm run cypress:open
```
