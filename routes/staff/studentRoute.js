const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  adminRegisterStudent,
  loginStudent,
  getStudentsProfile,
  getAllStudentsAdmin,
  getSingleStudentByAdmin,
  studentUpdateProfile,
  adminUpdateStudent,
  writeExam,
} = require("../../controller/students/studentsCtrl");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const isAuthenitcated = require("../../middlewares/isAuth");
const Student = require("../../model/Academic/Student");

const studentRouter = express.Router();

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);
studentRouter.post("/login", isLogin, isAdmin, loginStudent);

studentRouter.get(
  "/profile",
  isAuthenitcated(Student),
  isStudent,
  getStudentsProfile
);
studentRouter.get("/admin/profile", isLogin, isAdmin, getAllStudentsAdmin);
studentRouter.get(
  "/:studentID/admin",
  isLogin,
  isAdmin,
  getSingleStudentByAdmin
);

studentRouter.put("/update", isStudentLogin, isStudent, studentUpdateProfile);
studentRouter.put(
  "/:studentID/update/admin",
  isLogin,
  isAdmin,
  adminUpdateStudent
);

studentRouter.post("/exam/:examID/write", isStudentLogin, isStudent, writeExam);

module.exports = studentRouter;
