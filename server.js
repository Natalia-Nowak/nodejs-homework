const app = require("./app");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
