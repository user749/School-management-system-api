//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const YearGroup = require("../../model/Academic/YearGroup");
const Admin = require("../../model/Staff/Admin");

//  create Year Group
//  router POST /api/v1/year-groups/
//  @access private
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  // check if exists
  const yearGroupExsists = await YearGroup.findOne({ name });
  if (yearGroupExsists) {
    throw new Error("Year Group already exist");
  }

  // create
  const yearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  //find the admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin doesn't exists");
  }
  //push year group into admin
  admin.yearGroups.push(yearGroup._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Graduation Year Created Succesfully",
    data: yearGroup,
  });
});

//  get all year groups
//  router GET /api/v1/year-groups
//  @access private
exports.getYearGroups = AsyncHandler(async (req, res) => {
  //check if exists
  const yearGroup = await YearGroup.find();

  res.status(201).json({
    status: "success",
    message: "Year Groups fetched succesfully",
    data: yearGroup,
  });
});

//  get single Year Groups
//  router GET /api/v1/year-group/:id
//  @access private
exports.getSingleYearGroup = AsyncHandler(async (req, res) => {
  //check if exists
  const singleYearGroup = await YearGroup.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single Year Group fetched succesfully",
    data: singleYearGroup,
  });
});

//  update single year group subject
//  router PUT /api/v1/year-group/:id
//  @access private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  //check if name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("Year Group Already Exists");
  }

  const singleYearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    { name, academicYear, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Year Group updated succesfully",
    data: singleYearGroup,
  });
});

//  delete single year group
//  router DELETE /api/v1/year-group/:id
//  @access private
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year Group deleted successfully",
  });
});
