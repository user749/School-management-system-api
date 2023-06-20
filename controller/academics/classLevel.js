//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevel = require("../../model/Academic/ClassLevel");

//  create Class Level
//  router POST /api/v1/class-levels
//  @access private
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class Level already exists");
  }

  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Class created succesfully",
    data: classCreated,
  });
});

//  get class levels
//  router GET /api/v1/class-levels
//  @access private
exports.getClassLevels = AsyncHandler(async (req, res) => {
  //check if exists
  const classLevels = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class levels fetched succesfully",
    data: classLevels,
  });
});

//  get single class level
//  router GET /api/v1/class-levels/:id
//  @access private
exports.getSingleClassLevel = AsyncHandler(async (req, res) => {
  //check if exists
  const singleClassLevel = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single class level fetched succesfully",
    data: singleClassLevel,
  });
});

//  update single class level
//  router PUT /api/v1/class-levels/:id
//  @access private
exports.updateSingleClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check if name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class Level Already Exists");
  }

  const singleClassLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    { name, description, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Single Class Level updated succesfully",
    data: singleClassLevel,
  });
});

//  delete single class level
//  router DELETE /api/v1/class-levels/:id
//  @access private
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class Level deleted succesfully",
  });
});
