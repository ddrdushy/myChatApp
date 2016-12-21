# MyChaty

===================== this is a simple chat application created with `socket.io` and `node.js`. this is a sample for `real time data Synchronization` .

## Project Structure
=====================
```
Project
+-- data
|   +-- pending.json
|   +-- user.json
+-- public
|   +-- client.js
+-- views
|   +-- index.jade
+-- .env
+-- .gitignore
+-- app.js
+-- package.json
+-- Procfile
+-- README.md
```

## Dependencies
===================
```json
"engines": {
  "node": "6.9.1"
},
"dependencies": {
  "bootstrap": "^3.3.7",
  "express": "^4.14.0",
  "jade": "^1.11.0",
  "jquery": "^3.1.1",
  "jsonfile": "^2.4.0",
  "socket.io": "^1.7.2"
}
```

## Installation
===================
- use git to get the project `git clone https://github.com/ddrdushy/myChatApp.git`
- get in to the project folder `cd myChatApp`
- install dependencies `npm install`
- change the listen URL of the client `vim public/client.js`
- change the line

  ```
  var socket = io('http://mychaty.herokuapp.com');
  ```

  to

  ```
  var socket = io('http://localhost:3000');
  ```

- run the application `npm start`

## API Description
==========================
### Send Message to a specific user

```
GET /api/:from/:to/:message
```

```
from    : User name who sending the message
to      : User who receive the message
message : Message to be sent to the user
```
Note : If the user is not active the message will be stored in the **pending.json** file. it will sent back to the user when the user connects.

### get the online users list

```
GET /api/onlineusers
```

#### output

```json
{
    "ddr":"0F5cODZRJkEguDgeAAAA",
    "dushy":"guhQSpIu3h9XM9MVAAAB"
}
```
