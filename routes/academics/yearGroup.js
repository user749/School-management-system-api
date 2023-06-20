const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createYearGroup,
  getYearGroups,
  getSingleYearGroup,
  updateYearGroup,
  deleteYearGroup,
} = require("../../controller/academics/yearGroups");

const yearGroupRouter = express.Router();

yearGroupRouter
  .route("/")
  .post(isLogin, isAdmin, createYearGroup)
  .get(isLogin, isAdmin, getYearGroups);

yearGroupRouter
  .route("/:id")
  .get(isLogin, isAdmin, getSingleYearGroup)
  .put(isLogin, isAdmin, updateYearGroup)
  .delete(isLogin, isAdmin, deleteYearGroup);

module.exports = yearGroupRouter;
