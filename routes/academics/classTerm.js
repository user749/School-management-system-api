const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createClassLevel,
  getClassLevels,
  getSingleClassLevel,
  updateSingleClassLevel,
  deleteClassLevel,
} = require("../../controller/academics/classLevel");

const classLevelRouter = express.Router();

//academicYearRouter.post("/", isLogin, isAdmin, createAcademicYear);
//academicYearRouter.get("/", isLogin, isAdmin, getAcademicYears);

classLevelRouter
  .route("/")
  .post(isLogin, isAdmin, createClassLevel)
  .get(isLogin, isAdmin, getClassLevels);

classLevelRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleClassLevel)
  .put(isLogin, isAdmin, updateSingleClassLevel)
  .delete(isLogin, isAdmin, deleteClassLevel);

//academicYearRouter.get("/:id", isLogin, isAdmin, getSingleAcademicYear);
//academicYearRouter.put("/:id", isLogin, isAdmin, updateSingleAcademicYear);
//academicYearRouter.delete("/:id", isLogin, isAdmin, deleteSingleAcademicYear);

module.exports = classLevelRouter;
