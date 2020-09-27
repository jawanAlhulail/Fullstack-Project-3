//  استيراد المكتبات المطلوبة | import the required libraries
//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const setupRoutes = require("./routes/route.js");

// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests

// connect to mongodb

const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost/school", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to db lets create a app ");

    const app = express();
    app.use(express.json());

    setupRoutes(app);

    console.log("app routes is added lets listen on 3000  ");

    app.listen(3000);
  } catch (error) {
    console.error(error);
  }
};

start();
