const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createProgram,
  getPrograms,
  getSingleProgram,
  updateProgram,
  deleteProgram,
} = require("../../controller/academics/programs");

const programsRouter = express.Router();

programsRouter
  .route("/")
  .post(isLogin, isAdmin, createProgram)
  .get(isLogin, isAdmin, getPrograms);

programsRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleProgram)
  .put(isLogin, isAdmin, updateProgram)
  .delete(isLogin, isAdmin, deleteProgram);

module.exports = programsRouter;
