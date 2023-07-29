const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });

require("./database/connection");

app.use(cors());
app.use(express.json());
app.use(require("./router/auth"));
app.use(require("./router/payment"));
app.use(require("./router/product"));
app.use(require("./router/user"));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
