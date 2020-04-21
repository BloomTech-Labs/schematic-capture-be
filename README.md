[![Maintainability](https://api.codeclimate.com/v1/badges/b5735c25bf5c795c770c/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/schematic-capture-be/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b5735c25bf5c795c770c/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/schematic-capture-be/test_coverage)


# API Documentation

#### 1️⃣ Backend delpoyed at [Heroku](https://sc-be-production.herokuapp.com/) <br>

#### [Postman documentation](https://documenter.getpostman.com/view/10351390/Szf82TeL?version=latest) <br>

## 1️⃣ Getting started

To get the server running locally:

-   Clone this repo
-   **yarn** to install all required dependencies
-   **yarn server** to start the local server
-   **yarn test** to start server using testing environment
-   **yarn coverage** to get a coverage report


## 2️⃣ Endpoints

#### Authentication Routes

| Method | Endpoint                       | Access Control |                                                                |
| ------ | ------------------------------ | -------------- | -------------------------------------------------------------- |
| POST   | `api/auth/register`            | all users      | creates an account without an invite (development only)        |
| POST   | `api/auth/login`               | all users      | returns the user's info along with a token                     |
| POST   | `api/auth/forgotpassword`      | all users      | changes the user's password                                    |
| POST   | `api/auth/invite`              | admin          | sends an email to the invited person containing a unique token |
| POST   | `api/auth/firstlogin`          | all users      | Changes the user's password and security question & answer     |
| GET    | `api/auth/securityquestion/:id`| all users      | Gets the user's security question                              |
| GET    | `api/auth/questions`           | all users      | Returns an array of security questions from Okta               |

#### Clients Routes

| Method | Endpoint                    | Access Control   | Description                                             |
| ------ | --------------------------- | ---------------- | ------------------------------------------------------- |
| GET    | `/api/clients`              | employee / admin | returns all clients                                     |
| GET    | `/api/clients/:id/projects` | employee / admin | returns projects created for a specific client          |
| GET    | `/api/clients/withcompleted`| employee / admin | returns all clients with a completed boolean            |
| POST   | `/api/clients/:id/projects` | employee / admin | creates a new project for a specific client             |
| POST   | `/api/clients/create`       | employee / admin | creates a new client                                    |
| PUT    | `/api/clients/:id`          | employee / admin | edits a client's details                                |


#### Projects Routes

| Method | Endpoint                      | Access Control   | Description                                         |
| ------ | ----------------------------- | ---------------- | --------------------------------------------------- |
| GET    | `/api/projects/:id/jobsheets` | employee / admin | returns jobsheets created under a specific project. |
| PUT    | `/api/projects/:id/assignuser`| employee / admin | assigns a user to a project                         |


#### Jobsheets Routes

| Method | Endpoint                  | Access Control   | Description                                                 |
| ------ | ------------------------- | ---------------- | ----------------------------------------------------------- |
| POST   | `/api/jobsheets/create`   | employee / admin | creates a jobsheet                                          |
| GET    | `/api/jobsheets/:id`      | employee / admin | returns all components for a specific jobsheet              |
| GET   | `/api/jobsheets/assigned`  | technician       | returns jobsheets assigned to the authenticated technician. |
| GET   | `/api/jobsheets/:id`       | technician       | returns a jobsheet that corresponds to the id passed in params. |
| PUT   | `/api/jobsheets/:id/update`| admin            | edits a jobsheet that corresponds to the id passed in params. |

#### Roles Routes

| Method | Endpoint     | Access Control | Description                         |
| ------ | ------------ | -------------- | ----------------------------------- |
| GET    | `/api/roles` | all users      | returns an array of possible roles. |

# Data Model

#### 2️⃣ ORGANIZATIONS

---

```
{
  id: UUID
  name: STRING
  phone: STRING
  street: BOOLEAN
  city: STRING
  state: STRING
  zip: STRING
}
```

#### USERS

---

```
{
  id: UID from firebase
  role_id: INT foreign key in ROLES table
  first_name: STRING
  last_name: STRING
  email: STRING
  phone: STRING
}
```

#### USERS_ORGANIZATIONS

---

```
{
  user_email: STRING foreign key in USERS table
  organization_id: INT foreign key in ROLES table
}
```

#### INVITE_TOKENS

---

```
{
  id: Unique jwt
}
```

#### CLIENTS

---

```
{
  id: UUID
  organization_id: INT foreign key in ROLES table
  company_name: STRING
  phone: STRING
  street: STRING
  city: STRING
  state: STRING
  zip: STRING
}
```

#### PROJECTS

---

```
{
  id: UUID
  client_id: INT foreign key in CLIENTS table
  name: STRING
}
```

#### JOBSHEETS

---

```
{
  id: UUID
  updated_at: DATETIME
  staus: STRING
  user_email: STRING foreign key in USERS table
  name: STRING
  project_id: foreign key in PROJECTS table
}
```

#### CUSTOM_FIELDS

---

```
{
  id: UUID
  jobsheet_id: INT foreign key in JOBSHEETS table
  col_name: STRING
}
```

#### COMPONENTS

---

```
{
  id: UUID
  jobsheet_id: INT foreign key in JOBSHEETS table
  component_id: STRING
  rl_category: STRING
  rl_number: STRING
  descriptions: STRING
  manufacturer: STRING
  part_number: STRING
  stock_code: STRING
  component_application: STRING
  electrical_address: STRING
  reference_tag: STRING
  settings: STRING
  image: STRING
  resources: STRING
  cutsheet: STRING
  maintenance_video: STRING
  custom: STRING
}
```

#### CONTACTS

---

```
{
  id: UUID
  client_id: INT foreign key in CLIENTS table
  first_name: STRING
  last_name: STRING
  phone: STRING
  email: STRING
}
```

## 2️⃣ Actions

There is a Data Access Object class called `BaseModel` that can be easily extended. It contains typical database interactions that are commonly used.

`_find` -> Returns all rows in the table

`_findBy` -> Returns all rows matching the criteria provided (use the *.first()* method to only get one result)

`_findByMultiple` -> Returns all rows matching an array of one criteria

`_add` -> Adds row(s) to the table

`_update` -> Updates existing row(s) in the table matching the criteria provided

`_remove` -> Delete row(s) in the table matching the criteria provided

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

### Postgres configs for knex

-   DB_ENV=(environment the db is in [ie: development, staging, etc.])
-   DB_HOST=(address or hostname)
-   DB_PORT=(port number database is listening on)
-   DB_USER=(username for database)
-   DB_PASSWORD=(password for database)
-   DB_DATABASE=(name of database)

### Configs for firebase sdk 

The values for these variables can be found in the firebase console under the apps section. They are extracted from the provided JSON.
```javascript
const firebaseConfig = {
  apiKey: "-",
  authDomain: "-",
  databaseURL: "-",
  projectId: "-",
  storageBucket: "-",
  messagingSenderId: "-",
  appId: "-",
  measurementId: "-"
};
```

-   FB_KEY
-   FB_AUTH_DOMAIN
-   FB_DB_URL
-   FB_PROJECT_ID
-   FB_STORAGE_BUCKET
-   FB_MESSAGING_SENDER_ID
-   FB_APP_ID
-   FB_MEASUREMENT_ID

### configs for firebase-admin
Values can be retrieved from the JSON file created when making a new Service Account.

-   SERVICE_ACCOUNT_TYPE
-   SERVICE_ACCOUNT_PROJECT_ID
-   SERVICE_ACCOUNT_PRIVATE_KEY_ID
-   SERVICE_ACCOUNT_PRIVATE_KEY
-   SERVICE_ACCOUNT_CLIENT_EMAIL
-   SERVICE_ACCOUNT_CLIENT_ID
-   SERVICE_ACCOUNT_AUTH_URI
-   SERVICE_ACCOUNT_TOKEN_URI
-   SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL
-   SERVICE_ACCOUNT_CLIENT_X509_CERT_URL

### configs for sendgrid api

-   REGISTER_URL=(url for register route on frontend)
-   SG_API_KEY=(api key forthe sendgrid account)
-   SG_TEMPLATE_ID=(sendgrid template id)
-   INVITE_SECRET=(custom secret to sign invite token)


## Deploying a Postgres database with Docker for testing and/or development

An easy way to get a Postgres database running locally is to run it in a docker container. Follow the steps below in a terminal to get started.

1. `docker pull postgres`

2. `docker run --name container_name -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

3. Plug in the username (default user: postgres) and password chosen into the `.env` file (see above) for knex to pick up the correct configs. 

### Useful commands:

| Command                                   | Description                                          |
| ----------------------------------------- | ---------------------------------------------------- |
| `docker container stop container_name`    | kill the database container                          |
| `docker container start container_name`   | start the database container                         |
| `docker container restart container_name` | restart the database container                       |
| `docker container rm container_name`      | delete the container (container must not be running) |

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.
-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Create a live example of the problem.
-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Web Frontend Documentation](https://github.com/Lambda-School-Labs/schematic-capture-fe) for details on the fronend of our project.

See [iOS App Documentation](https://github.com/Lambda-School-Labs/schematic-capture-ios) for details on the iOS app.