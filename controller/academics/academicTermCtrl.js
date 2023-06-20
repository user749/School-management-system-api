//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
const Admin = require("../../model/Staff/Admin");

//  create academic Term Year
//  router POST /api/v1/academic-terms
//  @access private
exports.createAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  //check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    throw new Error("Academic year already exists");
  }

  //create
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });

  //push academic year into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic term created succesfully",
    data: academicTermCreated,
  });
});

//  fetch academic terms
//  router GET /api/v1/academic-terms
//  @access private
exports.getAcademicTerms = AsyncHandler(async (req, res) => {
  //check if exists
  const academicTerms = await AcademicTerm.find();

  res.status(201).json({
    status: "success",
    message: "Academic terms fetched succesfully",
    data: academicTerms,
  });
});

//  get single academic term
//  router GET /api/v1/academic-terms/:id
//  @access private
exports.getSingleAcademicTerm = AsyncHandler(async (req, res) => {
  //check if exists
  const singleAcademicTerm = await AcademicTerm.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single Academic terms fetched succesfully",
    data: singleAcademicTerm,
  });
});

//  update single academic term
//  router PUT /api/v1/academic-term/:id
//  @access private
exports.updateSingleAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  //check if name exists
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    throw new Error("Academic Term Already Exists");
  }

  const singleAcademicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    { name, description, duration, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Academic term updated succesfully",
    data: singleAcademicTerm,
  });
});

//  delete single academic term
//  router DELETE /api/v1/academic-term/:id
//  @access private
exports.deleteSingleAcademicTerm = AsyncHandler(async (req, res) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic term deleted succesfully",
  });
});
