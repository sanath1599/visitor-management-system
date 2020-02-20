//Imports
const express = require("express"),
      bodyParser = require("body-parser"),
      cors = require('cors'),
      app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
// app.options('*', cors())
// app.use(cors());
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.set("port", PORT);
app.set("env", NODE_ENV);

const routes = require('./routes.js');
routes(app);

app.listen(PORT, () => console.log('Server is up and running on ' + PORT + ' Environment: ' + NODE_ENV));
