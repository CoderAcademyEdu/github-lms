# GitHub LMS

An open-source LMS that authenticates with GitHub and uses a separate private repository for content management

## Development

### Dependencies

Install [PostgreSQL](https://www.postgresql.org/download/)

### Running Development Environment Locally

```
git clone https://github.com/dijonmusters/github-lms.git
```

```
cd github-lms
npm install
touch .env
```

In another terminal window:

```
cd client
npm install
touch .env
```

Populate root .env file with:

```
NODE_ENV='development'
SECRET='<any-string-you-would-like>'
GITHUB_TOKEN='<github-personal-access-token>'
GITHUB_BASE_URL='https://api.github.com/repos/<owner-or-organisation>/<repo-name>/contents'
GITHUB_CLIENT_ID='<organisation-oauth-client-id>'
GITHUB_CLIENT_SECRET='<organisation-oauth-client-secret>'
GITHUB_CALLBACK='http://localhost:3000/github/callback'
```

`SECRET` is used for cookie sessions and can be any string you would like to set it to. I recommend randomly generating a complex string to improve security.

`GITHUB_TOKEN` needs to be created on a personal github account that has at least `read` contributor access to the private repository that will be used to host the educational content. This cannot be done from an organisation github account. To generate a new token go to `Settings > Developer Settings > Personal access tokens > Generate new token`. Fill in the `description` as whatever you would like, tick `repo` box and click `Generate token`. You will only have this one chance to access the token string so make sure you copy it into the `.env` file before continuing on.

`GITHUB_BASE_URL` is the path for the github API to pull the private content from. The string needs to be as shown above, with the owner/organisation and repo name filled in for your particular private repo that will host the educational content. Again, the account that you used to generate the token above needs to have at least `read` contributor access to the private repository.

`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` can be generated from a personal or organisation github account. You will need to generate one for local development and another the deployed version of the application. Go to `Settings > oAuth apps > New oAuth app`. Fill in anything as the application name. The homepage URL will be `http://localhost:3000` for running locally and the URL of your deployed app for the production version - `https://m0218.herokuapp.com` for example. Description can be anything you would like. `Authorization callback URL` should be `http://localhost:3000/github/callback` for development version, substituting the host for your deployed application for the production version - `https://m0218.herokuapp.com/github/callback` for example. Click `Register application` to create the ID and SECRET. Repeat the steps to create a production version.

`GITHUB_CALLBACK` should be set to `http://localhost:3000/github/callback` in the `.env` file.

Populate the client/.env file with:
REACT_APP_COHORT='<cohort-code>'

The value should be set to the Cohort code - `MELB_2018` for example.

Create a development db

```
createdb gh_lms_development
```

In the root terminal tab/window run API

```
npm run dev
```

In the client terminal tab/window run frontend

```
npm start
```

## Deployment

Ensure you have set the cohort code in client/.env - for the deployment example I will use `MELB_2018`.

Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) if you have not already done so

Create a new heroku app for the cohort

```
heroku create melb_2018
```

Create a hobby postgreSQL database as Heroku addon

```
heroku addons:create heroku-postgresql:hobby-dev
```

Navigate to [Heroku dashboard]() and click `Heroku Postgres` under Installed add-ons

When postgres database has loaded in another tab, click `Settings` then `Reveal Credentials`. This contains all the database information to connect our Node app to our DB.

Create new Github OAuth credentials for deployment - see `Development` section for steps to complete this.

Application Name: MELB_2018
Homepage URL: https://melb_2018.herokuapp.com
Authorization callback URL: https://melb_2018.herokuapp.com/github/callback

Set Heroku environment variables - see `Development` section for more information about each of the environment variables.

```
heroku config:set REACT_APP_COHORT="MELB_2018" SECRET='<secret-for-session/cookie>' GITHUB_TOKEN='<generate-from-personal-github>' GITHUB_BASE_URL='<url-for-content>' GITHUB_CLIENT_ID='<get-from-github-oauth-page>' GITHUB_CLIENT_SECRET='<get-from-github-oauth-page>' DB_USER='<get-from-postgres-dashboard>' DB_PASSWORD='<get-from-postgres-dashboard>' DB_NAME='<get-from-postgres-dashboard>' DB_HOST='<get-from-postgres-dashboard>'
```

Add a heroku remote if git has not done this automatically for you

```
git remote add heroku <url-to-heroku-app.git>
```

Push new app to heroku

```
git push heroku master
```

Navigate to the [melb_2018 app page](https://melb_2018.herokuapp.com) and login with GitHub.

Connect to the Postgres instance with the CLI path listed under `Heroku CLI` in the Heroku Postgres dashboard

Run the following SQL statement to check the users that have created accounts.

```
SELECT * FROM "Users";
```

Take note of your login field and press `q` to quit out of the results view.

Run the following SQL statement to upgrade your role to teacher

```
UPDATE "Users" SET "role" = 'teacher' WHERE "login" = '<your-login>';
```

Logout of the melb_2018 app and login again. You should now see the modules and enrolment options in the navbar.