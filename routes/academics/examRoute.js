const express = require("express");

const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const isTeacher = require("../../middlewares/isTeacher");
const {
  createExam,
  getAllExams,
  getSingleExam,
  updateSingleExam,
} = require("../../controller/academics/examsCtrl");

const examRouter = express.Router();

examRouter
  .route("/")
  .post(isTeacherLogin, isTeacher, createExam)
  .get(isTeacherLogin, isTeacher, getAllExams);

examRouter
  .route("/:id")
  .get(isTeacherLogin, isTeacher, getSingleExam)
  .put(isTeacherLogin, isTeacher, updateSingleExam);

module.exports = examRouter;
