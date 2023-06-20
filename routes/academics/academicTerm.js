const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createAcademicTerm,
  getAcademicTerms,
  getSingleAcademicTerm,
  updateSingleAcademicTerm,
  deleteSingleAcademicTerm,
} = require("../../controller/academics/academicTermCtrl");

const academicTermRouter = express.Router();

//academicYearRouter.post("/", isLogin, isAdmin, createAcademicYear);
//academicYearRouter.get("/", isLogin, isAdmin, getAcademicYears);

academicTermRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicTerm)
  .get(isLogin, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleAcademicTerm)
  .put(isLogin, isAdmin, updateSingleAcademicTerm)
  .delete(isLogin, isAdmin, deleteSingleAcademicTerm);

//academicYearRouter.get("/:id", isLogin, isAdmin, getSingleAcademicYear);
//academicYearRouter.put("/:id", isLogin, isAdmin, updateSingleAcademicYear);
//academicYearRouter.delete("/:id", isLogin, isAdmin, deleteSingleAcademicYear);

module.exports = academicTermRouter;
