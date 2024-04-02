This project showcases integrating Google authentication into a Nest.js application. Nest.js, known for its efficiency and scalability, serves as the framework. The main focus lies in implementing user authentication via Google OAuth, a secure and convenient mechanism where users can sign in using their Google credentials, eliminating password exposure.

The flow is as follows:

1. The user is directed to an endpoint on our server and is automatically redirected to the Google login screen.
2. After placing your credentials, you will be redirected to another endpoint of our server where we will receive all the user information.
3. We will look for the user in our database:
   - If the user exists: We return `refreshToken` and `accessToken` that contains the user’s ID and email
   - If the user does not exist: We register the user in our database and return `refreshToken` and `accessToken`
4. We use the JSON Web Token to make authenticated requests

## Diagram

![Diagram OAuth](/images/diagram.webp)

## Setup environment

```env
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_AUTH_CALLBACK_URL=http://localhost:3000/api/auth/google/redirect

JWT_ACCESS_SECRET=<jwt-secret>
JWT_REFRESH_SECRET=<refresh -secret>
```

## Install library

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-google-oauth2 passport-jwt passport-local

npm install -D @types/passport-google-oauth2 @types/passport-jwt @types/passport-jwt @types/passport-local
```

## Run project

```bash
pnpm start:dev
```
