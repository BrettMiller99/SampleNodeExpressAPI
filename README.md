# Sample API

This is a sample API built with NodeJS and Express.

## Endpoints

- `GET /api/users`: Retrieve a list of users
- `POST /api/users`: Create a new user

## Authentication

- Use the `Authorization` header with a valid JWT token to authenticate requests.

## Environment Variables

- `PORT`: The port number to listen on (default: 3000)
- `NODE_ENV`: The environment (default: development)
- `SECRET_KEY`: The secret key for JWT authentication
