const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require('express-fileupload');
var jsonServer = require('json-server');
const path = require('path');
var fs = require('fs');

const range = require('./range');
const User = require('./models/users.models');
const Course = require('./models/courses.models');

const loadDB = async () => {
  console.log('load');
  var users = await User.find();
  var users2 = []; // create an empty array
  users.forEach(function (arr) {
    users2.push({
      id: arr._id,
      email: arr.email,
      password: arr.password,
      name: arr.name,
      role: arr.role,
    }); // push in the array
  });
  console.log(users2);

  var courses = await Course.find();
  var courses2 = []; // create an empty array
  courses.forEach(function (arr) {
    courses2.push({
      id: arr._id,
      name: arr.name,
      teacher: arr.teacher,
      description: arr.description,
      membership: arr.membership,
    }); // push in the array
  });
  const db = { users: users2, courses: courses2 };
  fs.writeFile('db', JSON.stringify(db), function (err) {
    if (err) throw err;
    console.log('complete');
  });
};
require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;

mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log('MongoDB Connected');
  }
);

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(upload());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require('./middlewares/routes.mdw.js')(app);

loadDB();
app.use(
  '/api',
  range,
  jsonServer.defaults(),
  jsonServer.router(path.join(__dirname, 'db'))
);

app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
