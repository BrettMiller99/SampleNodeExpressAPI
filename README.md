# Sample Node Express API

A simple API for managing users.

## Endpoints

- `GET /api/users`: Retrieve a list of users
- `POST /api/users`: Create a new user

## Authentication

This API uses JSON Web Tokens (JWT) for authentication. To authenticate requests, include a valid JWT token in the `Authorization` header.

## Environment Variables

- `PORT`: The port number to listen on (default: 3000)
- `NODE_ENV`: The environment (default: development)
- `SECRET_KEY`: The secret key for JWT authentication

## Usage

To start the API, run `npm start`. This will start the server on the specified port.

You can use a tool like `curl` or a REST client to test the API endpoints.

## Notes

This API is a basic example and should not be used in production without proper security measures and testing.
