const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const chalk = require("chalk");
const routes = require("./routes");
const initDatabase = require("./startUp/initDatabase");

const app = express();

app.use(cors())

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET", true);
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

const PORT = config.get("port") ?? 8080;

async function start() {
  try {
    mongoose.connection.once("open", () => {
      initDatabase();
    });
    await mongoose.connect(config.get("mongoUri"));
    console.log(chalk.green("MongoDB connected"));
    app.listen(PORT, () => {
      console.log(chalk.green(`Server has been started on port ${PORT}...`))
    })
  } catch (e) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }


};

start();