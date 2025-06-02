const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Router = require('./routes/routes.js');
const useragent = require('express-useragent');

dotenv.config()

const db = require('./config/db.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use(useragent.express());


app.use("/api", Router)

app.listen(process.env.PORT)
