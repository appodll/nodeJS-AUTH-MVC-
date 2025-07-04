const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require('./routes/auth_routes.js');
const socialRouter = require('./routes/social_routes.js');
const followRouter = require('./routes/follow_routes.js');
const useragent = require('express-useragent');

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use(useragent.express());


app.use("/api/auth", authRouter)
app.use('/api/social', socialRouter)
app.use("/api/following", followRouter)


app.listen(process.env.PORT,)
