//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");

//  create academic year
//  router POST /api/v1/academic-years
//  @access private
exports.createAcademicYear = AsyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;

  //check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    throw new Error("Academic year already exists");
  }

  //create
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth._id,
  });

  //push academic year into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic year created succesfully",
    data: academicYearCreated,
  });
});

//  fetch academic years
//  router GET /api/v1/academic-years
//  @access private
exports.getAcademicYears = AsyncHandler(async (req, res) => {
  //check if exists
  const academicYears = await AcademicYear.find();

  res.status(201).json({
    status: "success",
    message: "Academic year fetched succesfully",
    data: academicYears,
  });
});

//  get single academic year
//  router GET /api/v1/academic-years/:id
//  @access private
exports.getSingleAcademicYear = AsyncHandler(async (req, res) => {
  //check if exists
  const singleAcademicYear = await AcademicYear.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single Academic year fetched succesfully",
    data: singleAcademicYear,
  });
});

//  update single academic year
//  router PUT /api/v1/academic-years/:id
//  @access private
exports.updateSingleAcademicYear = AsyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;

  //check if name exists
  const academicYearFound = await AcademicYear.findOne({ name });
  if (academicYearFound) {
    throw new Error("Academic Year Already Exists");
  }

  const singleAcademicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    { name, fromYear, toYear, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Academic year updated succesfully",
    data: singleAcademicYear,
  });
});

//  delete single academic year
//  router DELETE /api/v1/academic-years/:id
//  @access private
exports.deleteSingleAcademicYear = AsyncHandler(async (req, res) => {
  await AcademicYear.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic year deleted succesfully",
  });
});
