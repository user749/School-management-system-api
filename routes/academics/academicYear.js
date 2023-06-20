const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createAcademicYear,
  getAcademicYears,
  getSingleAcademicYear,
  updateSingleAcademicYear,
  deleteSingleAcademicYear,
} = require("../../controller/academics/academicYearCtrl");

const academicYearRouter = express.Router();

academicYearRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicYear)
  .get(isLogin, isAdmin, getAcademicYears);

academicYearRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleAcademicYear)
  .put(isLogin, isAdmin, updateSingleAcademicYear)
  .delete(isLogin, isAdmin, deleteSingleAcademicYear);

module.exports = academicYearRouter;
