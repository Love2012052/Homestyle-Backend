const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });

require("./database/connection");

app.use(cors());

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/cart"));
app.use(require("./routes/message"));
app.use(require("./routes/order"));
app.use(require("./routes/payment"));
app.use(require("./routes/product"));
app.use(require("./routes/user"));

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
