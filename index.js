"use strict"

const express = require ('express')
const sequelize = require ("./sequelize")
require("./models/notes");

const app = express();

app.listen(7000, async () => {
    console.log("Server started on http://localhost:7000");

    try {
await sequelize.authenticate();
console.log("Connection estabilished");

    } catch (err) {
console.error("unable to connect to db:", err);
    }
});

app.use("/api", require("./routes/notes"))