const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const isTeacher = require("../../middlewares/isTeacher");
const {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateSingleQuestion,
} = require("../../controller/academics/questionsCtrl");

const questionsRouter = express.Router();

questionsRouter.post("/:examID", isTeacherLogin, isTeacher, createQuestion);

questionsRouter.get("/", isTeacherLogin, isTeacher, getAllQuestions);
questionsRouter.get("/:id", isTeacherLogin, isTeacher, getSingleQuestion);

questionsRouter.put("/:id", isTeacherLogin, isTeacher, updateSingleQuestion);

module.exports = questionsRouter;
