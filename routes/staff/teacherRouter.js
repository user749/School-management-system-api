const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacher,
} = require("../../controller/staff/teachersCtrl");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const isTeacher = require("../../middlewares/isTeacher");
const advancedResults = require("../../middlewares/advancedResults");
const Teacher = require("../../model/Academic/Teacher");

const teacherRouter = express.Router();

teacherRouter.post("/admin/register", isLogin, isAdmin, adminRegisterTeacher);

teacherRouter.post("/login", loginTeacher);

teacherRouter.get(
  "/admin",
  isLogin,
  isAdmin,
  advancedResults(Teacher, {
    path: "examsCreated",
    populate: { path: "questions" },
  }),
  getAllTeachersAdmin
);

teacherRouter.get("/:teacherID/admin", isLogin, isAdmin, getTeacherByAdmin);

teacherRouter.get("/profile", isTeacherLogin, isTeacher, getTeacherProfile);

teacherRouter.put(
  "/:teacherID/update",
  isTeacherLogin,
  isTeacher,
  teacherUpdateProfile
);

teacherRouter.put(
  "/:teacherID/update/admin",
  isLogin,
  isAdmin,
  adminUpdateTeacher
);

module.exports = teacherRouter;
