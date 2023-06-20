const express = require("express");
const morgan = require("morgan");
const adminRouter = require("../routes/staff/adminRouter");
const {
  globalErrHandler,
  notFoundErr,
} = require("../middlewares/globalErrHandler");

const academicYearRouter = require("../routes/academics/academicYear");
const academicTermRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classTerm");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const yearGroupRouter = require("../routes/academics/yearGroup");
const teacherRouter = require("../routes/staff/teacherRouter");
const examRouter = require("../routes/academics/examRoute");
const studentRouter = require("../routes/staff/studentRoute");
const questionsRouter = require("../routes/academics/questionRoutes");
const examResultsRouter = require("../routes/academics/examResultsRouter");

const app = express();

//Middlewares
app.use(express.json()); //pass incoming json data

//Routes
//admin register; use() can accept any request type (get, post, delete)
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/exam-results", examResultsRouter);

//Error middleware
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
