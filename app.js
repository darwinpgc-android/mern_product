require("dotenv").config(); // importing 'dotEnv' file


const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')

const app = express();

// DB connection ..............
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`DB connected successfully `);
  })
  .catch(() => {
    console.log("Check your connection");
  });

// middleware .............

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes

app.use("/api", authRoutes);
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)


app.get("/home", (req, res) => {
  res.json({
    message: 'Home page'
  })
})


// Port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running at : ${port}`);
});
