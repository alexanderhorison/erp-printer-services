require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Print server is running");
});

app.use(router);

app.listen(port, () => {
  console.log(`Print server running on http://localhost:${port}`);
});
