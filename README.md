# Codejo

An open-source LMS for content hosted in GitHub markdown files

## Development

### Dependencies

Install [PostgreSQL](https://www.postgresql.org/download/)

Create a development db

```
createdb codejo_development
```

### Running Development Environment Locally

```
git clone https://github.com/dijonmusters/codejo.git
```

```
cd codejo
npm install
touch .env
npm run dev
```

In another terminal window:

```
cd client
npm install
touch .env
npm start
```

Populate root .env file with:
NODE_ENV='development'
SECRET=''
GITHUB_TOKEN=''
GITHUB_BASE_URL=''
GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''
GITHUB_CALLBACK=''
DB_USER=''
DB_PASSWORD=''
DB_NAME=''
DB_HOST=''

The values for these keys can be obtained from someone on the teaching team or generated from Github and Heroku.

Populate the client/.env file with:
REACT_APP_COHORT=''

The value should be set to the Cohort code - `MELB_2018` for example.

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

Create new Github OAuth credentials for deployment - Settings > Developer Settings > OAuth Apps > New OAuth App

Application Name: MELB_2018
Homepage URL: https://melb_2018.herokuapp.com
Authorization callback URL: https://melb_2018.herokuapp.com/github/callback

Set Heroku environment variables

```
heroku config:set REACT_APP_COHORT="MELB_2018" SECRET='<secret-for-session>' GITHUB_TOKEN='<generate-from-personal-github>' GITHUB_BASE_URL='<url-for-content>' GITHUB_CLIENT_ID='<get-from-github-oauth-page>' GITHUB_CLIENT_SECRET='<get-from-github-oauth-page>' DB_USER='<get-from-postgres-dashboard>' DB_PASSWORD='<get-from-postgres-dashboard>' DB_NAME='<get-from-postgres-dashboard>' DB_HOST='<get-from-postgres-dashboard>'
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

Run the following SQL statement to check the users that have created accounts. Take note of your login field.

```
SELECT * FROM "Users";
```

Press `q` to quit out of the results view.

Run the following SQL statement to upgrade your role to teacher or admin

```
UPDATE "Users" SET "role" = 'teacher' WHERE "login" = '<your-login>';
```

Logout of the melb_2018 app and login again. You should now see the modules and be able to enrol other students