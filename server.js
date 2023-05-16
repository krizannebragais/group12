const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine (assuming you're using a template engine like EJS)
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'register.html'));
});

app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'chat.html'));
});


// Middleware to parse request body
app.use(bodyParser.json());

app.post('/addUser', function(req, res) {
  // Read existing users data
  fs.readFile(__dirname + '/assets/js/users.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send('Error reading users data.');
    }

    const usersData = JSON.parse(data);

    // Get the current number of users
    const userCount = Object.keys(usersData.users[0]).length;

    // Get the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Create a new user object
    const newUser = {
      username: username,
      password: password
    };

    // Add the new user to the users data
    usersData.users[0]['user' + (userCount + 1)] = newUser;

    // Write the updated users data back to the file
    fs.writeFile(__dirname + '/assets/js/users.json', JSON.stringify(usersData), 'utf8', function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send('Error adding user.');
      }
      console.log('User added successfully!');
      res.status(200).send('User added successfully!');
    });
  });
});

app.get('/getUsers', function(req, res) {
  fs.readFile(__dirname + "/assets/js/users.json", 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send("Error reading users data.");
    }
    console.log(data);
    res.send(data);
  });
});

// Serve images from the 'assets/img/' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

