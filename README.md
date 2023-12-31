# spotify-app-server

## Description
Simple server which uses spotify API's to fetch user profile and playlists.

## Table of Contents
1. [Installation](#installation)
2. [Test](#test)
3. [API docs](#apidocs)


## Installation
To set up and run the server locally, follow these steps:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Selbin/spotify-app-server.git
   ```

2. Navigate to the project directory:
   ```bash
   cd spotify-app-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Create .env file using the fields in .env.example
5. Start the server:
   ```bash
   npm start
   ```

The server will be running at `http://localhost:3001`.

## Test
1. Add test MONGODB_URI to jest.setup.js file
2. Run:
   ```bash
   npm test
   ```

## API docs
1. Start the server:
   ```bash
   npm start
   ```
2. The API docs will be available at `http://localhost:3001/api-docs`

