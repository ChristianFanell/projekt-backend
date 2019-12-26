const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const port = 1337;


require('dotenv').config()

const trade = require('./routes/trade.js');
const auth = require('./routes/auth.js');


let jwt = process.env.JWT_SECRET;

if (process.env.NODE_ENV != 'test') {
    app.use(morgan('combined'));
}

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/trade', trade);
app.use('/auth', auth);


// Start up server
const server = app.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = server;
