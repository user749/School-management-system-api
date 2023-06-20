const express = require("express");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const isTeacher = require("../../middlewares/isTeacher");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
} = require("../../controller/academics/examResults");

const examResultsRouter = express.Router();

examResultsRouter.get(
  "/:id/checking",
  isStudentLogin,
  isStudent,
  checkExamResults
);

examResultsRouter.get("/", isStudentLogin, isStudent, getAllExamResults);

examResultsRouter.put(
  "/:id/admin-toggle-publish",
  isLogin,
  isAdmin,
  adminToggleExamResult
);

module.exports = examResultsRouter;
