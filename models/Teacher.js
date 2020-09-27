// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module
const { Schema, model } = require("mongoose");
const hashPassword = require("../helper");
const shortId = require("shortid");
// 1. قم باستيراد مكتبة moongoose | import the mongoose library

// 2. قم بتحديد مخطط المدرس | start defining your user schema
const teacherSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  birthdate: String,
  salt: String,
});
teacherSchema.pre("save", async function (next) {
  this.salt = shortId.generate();
  this.password = await hashPassword(this.password, this.salt);
  console.log(this.password);
});
// 3. إنشاء نموذج المدرس | create  the user model
const teacherModel = new model("Users", teacherSchema);
// تخزين كلمة السر بعد عمل الهاش

// 4. تصدير الوحدة | export the module
module.exports = teacherModel;
