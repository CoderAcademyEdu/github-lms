# GitHub LMS

An open-source LMS that authenticates with GitHub and uses a separate private repository for content management

## Video Tutorials

### Deployment

https://youtu.be/2z8zrO5HSzk

## Development

### Dependencies

Install [PostgreSQL](https://www.postgresql.org/download/)

A private GitHub repository, either on a personal or organisation account, to use for managing educational materials. This repo will need to implement the following folder structure:

```
cohort-code
  challenges
    module_name
      challenge.md files
  code
    module_name
      code_example.zip files
  modules
    module_name
        lesson.md files

```

The outer most folder should be named with the cohort code. This will be something you will need throughout the development and deployment sections so make sure you pick something you are happy with. Our example repo uses the code `M0218`.

Inside the cohort folder there should be three folders named `challenges`, `code` and `modules`. This can be extended later, but they are the only three directories that the current iteration of the app has access to.

Inside each of these folders should be a folder for every module in the course with a sequential number followed by the name of the module - for example `01_Ruby`, `02_Rails` and `03_MERN`. This same folder structure should exist in all three of these folders and is how we will keep a track of the different modules we are currently teaching, making it easy to share particular modules between different courses, or easily deprecate a particular module that we no longer want to include in a course.

Inside the `cohort-code/challenges/module-name` folder there should be a collection of markdown files that are individual challenges. You can now link to a challenge from a lesson to make it available to students.

Inside the `cohort-code/code/module-name` folder there should be a collection of zip files that are individual code examples - for example one .zip for the starter code before a lesson and another one for the final version after the lesson. You can then link to these files from a lesson to make them available to students.

Inside the `cohort-code/modules/module-name` folder there should be a collection of markdown files that are individual lessons that are student facing. Each one of these markdown files should be named with a sequence number and then the name of the lesson - for example `01_fetch_and_promises.md`. Each one of these files is one instance of a lesson so should contain any student facing content that you want students to access - lecture video, example code zip files, walkthrough steps, links to related challenges and further reading/watching resources.

Example lesson.md file

```
---
title: Passport, Sessions and Cookies
lecture_video: https://youtu.be/18ZBXBgGa8M
downloads:
  - name: example code
    url: ../../code/06_MERN/passport_sessions_example.zip
---

## Walkthrough

Watch through the video to see how Passport can be used to implement sessions and cookies in a node API.

## Challenges

1. [Re-implement the passport example in your own project](../../challenges/06_MERN/reimplement_passport_example.md)

## Further Reading

Check out [this awesome search engine](http://google.com) to find answers to any questions!
```

The section at the top of the file is called `frontmatter`, it is basically a collection of varibales that we can then access in the frontend. We are setting a title, lecture video and downloads that we want to make available for this lesson. `Title` is the only one that is required, `lecture_video` and `downloads` are optional and should be entirely removed if there is no video or downloads for a particular lesson.

Everything below the frontmatter will be converted to HTML and displayed by the frontend.

Example challenge.md file

```
---
title: Implement Registration
---

## Challenge

Extend the authentication example by implementing a new registration route. This should allow the user to send a `POST` request to `/auth/register` with their `username` and `password` in the body of the request.

The callback should do the following:

    * Validate the user has provided a username and password
    * Confirm the user does not already exist in MongoDB
    * Create a new user in MongoDB
    * Generate a token
    * Return the token or a valid error if these conditions are not met

Confirm this works with Postman and that the generated token can be used to access protected routes.
```

Again this has some frontmatter, which is currently just a mandatory title. Similarly to the lesson.md file everything below the frontmatter section will be converted to html and rendered by the frontend.

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
CAMPUS_IP=<external-IP-address-for-campus>
```

`SECRET` is used for cookie sessions and can be any string you would like to set it to. I recommend randomly generating a complex string to improve security.

`GITHUB_TOKEN` needs to be created on a personal github account that has at least `read` contributor access to the private repository that will be used to host the educational content. This cannot be done from an organisation github account. To generate a new token go to `Settings > Developer Settings > Personal access tokens > Generate new token`. Fill in the `description` as whatever you would like, tick `repo` box and click `Generate token`. You will only have this one chance to access the token string so make sure you copy it into the `.env` file before continuing on.

`GITHUB_BASE_URL` is the path for the github API to pull the private content from. The string needs to be as shown above, with the owner/organisation and repo name filled in for your particular private repo that will host the educational content. Again, the account that you used to generate the token above needs to have at least `read` contributor access to the private repository.

`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` can be generated from a personal or organisation github account. You will need to generate one for local development and another the deployed version of the application. Go to `Settings > oAuth apps > New oAuth app`. Fill in anything as the application name. The homepage URL will be `http://localhost:3000` for running locally and the URL of your deployed app for the production version - `https://m0218.herokuapp.com` for example. Description can be anything you would like. `Authorization callback URL` should be `http://localhost:3000/github/callback` for development version, substituting the host for your deployed application for the production version - `https://m0218.herokuapp.com/github/callback` for example. Click `Register application` to create the ID and SECRET. Repeat the steps to create a production version.

`GITHUB_CALLBACK` should be set to `http://localhost:3000/github/callback` in the `.env` file.

`CAMPUS_IP` is the external IP address for the campus that the students will be studying from. This can be obtained by connecting to the campus WIFI and visiting [What's my IP?](http://www.whatsmyip.org/).

Populate the client/.env file with:

```
REACT_APP_COHORT="<cohort-code>"
```

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
heroku config:set REACT_APP_COHORT="MELB_2018" SECRET='<secret-for-session/cookie>' GITHUB_TOKEN='<generate-from-personal-github>' GITHUB_BASE_URL='<url-for-content>' GITHUB_CLIENT_ID='<get-from-github-oauth-page>' GITHUB_CLIENT_SECRET='<get-from-github-oauth-page>' DB_USER='<get-from-postgres-dashboard>' DB_PASSWORD='<get-from-postgres-dashboard>' DB_NAME='<get-from-postgres-dashboard>' DB_HOST='<get-from-postgres-dashboard>' CAMPUS_IP='<get-from-whatsmyip.org>'
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

Now that you have one teacher they should be able to promote other users to teachers from the enrolment page - you should only need to run the SQL update statement above for the first teacher account.