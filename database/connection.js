const mongoose = require("mongoose");

const database = process.env.DATABASE;

mongoose
  .connect(database)
  .then(() => {
    console.log("The connection has been successfully established!");
  })
  .catch((err) => console.log(err));
