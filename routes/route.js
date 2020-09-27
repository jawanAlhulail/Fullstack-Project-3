// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
const hashPassword = require("../helper.js");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

// 1. استيراد وحدةالمدرس | import the teacher module
const teacherModel = require("../models/Teacher.js");
// 2. استيراد وحدة الطالب | import the student module
const studentModel = require("../models/Student");
const { verify } = require("crypto");

const setupRoutes = function (app) {
  app.get("/students", async (req, res) => {
    try {
      await studentModel.find(async (err, students) => {
        res.status(200).json(students);
        const token = req.headers.authorization;
        if (!token) {
          res.send("you dont have permission");
          return;
        }

        const decodedToken = jwt.decode(token);

        const user = await teacherModel.findById(decodedToken.sub);
        if (!user) {
          res.send("you dont have permisson");
        }
        jwt.verify(token, user.salt);
      });
    } catch (error) {
      res.status(401).send({ error: error });
    }
  });
  // students register
  app.post("/student/register", async (req, res) => {
    const { name, email, city, birthdate } = req.body;
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      city: Joi.string().required(),
      birthdate: Joi.string().required(),
    });

    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newStudent = new studentModel({
        name,
        email,
        city,
        birthdate,
      });

      await newStudent.save();

      res.send(newStudent);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });
  // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
  app.post("/teacher/register", async (req, res) => {
    const { name, email, password, birthdate } = req.body;
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().min(6).required(),
      birthdate: Joi.string().required(),
    });
    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newTeacher = new teacherModel({
        name,
        email,
        password,
        birthdate,
      });

      await newTeacher.save();

      res.send(newTeacher);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });

  // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token
  app.post("/teacher/login", async (req, res) => {
    const { email, password } = req.body;
    const TeacherAcc = await teacherModel.findOne({ email });
    if (!TeacherAcc) {
      // res.statusCode(404);
      res.send("user not found");
    } else {
      if (TeacherAcc.password === hashPassword(password, TeacherAcc.salt)) {
        const token = jwt.sign({ sub: TeacherAcc._id }, "" + TeacherAcc.salt, {
          expiresIn: 30,
        });
        res.send(token);
      } else {
        // res.statusCode = 403;
        res.send("password is wrong");
      }
    }
  });

  // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)

  app.put("/student/:id", async (req, res) => {
    const { id } = req.params;
    const studentUser = await studentModel.findById(id);

    if (!studentUser) {
      res.statusCode = 404;
      res.send("user id is not correct ");
    } else {
      const { birthdate, city, name, email } = req.body;

      if (email || city || birthdate || name) {
        studentUser.birthdate = birthdate;
        studentUser.city = city;
        studentUser.email = email;
        studentUser.name = name;

        studentUser.save();
      }
      res.send(studentUser);
    }
  });
  app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    const studentUser = await studentModel.deleteOne({ _id: id });
    res.send(studentUser);
  });
};
// 3. تصدير الوحدة | export the module

module.exports = setupRoutes;
