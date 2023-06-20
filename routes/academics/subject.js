const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createSubject,
  getSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} = require("../../controller/academics/subjects");

const subjectsRouter = express.Router();

subjectsRouter.post("/:programID", isLogin, isAdmin, createSubject);

subjectsRouter.get("/", isLogin, isAdmin, getSubjects);

subjectsRouter.get("/:id", isLogin, isAdmin, getSingleSubject);

subjectsRouter.put("/:id", isLogin, isAdmin, updateSubject);

subjectsRouter.delete("/:id", isLogin, isAdmin, deleteSubject);

module.exports = subjectsRouter;
