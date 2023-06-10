const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");
const socketIO = require("./middelwear/socket");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketIO.initialize(server);
const route = require("./routes/routes");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", route);
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
  })

  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
