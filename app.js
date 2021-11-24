const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;
// const { PORT, MONGODB_URI } = require('./config');
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
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require('./middlewares/routes.mdw.js')(app);

app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
