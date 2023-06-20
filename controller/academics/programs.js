//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");

//  create Program
//  router POST /api/v1/programs
//  @access private
exports.createProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program already exists");
  }

  // create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  //push program into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Program created succesfully",
    data: programCreated,
  });
});

//  get all programs
//  router GET /api/v1/programs
//  @access private
exports.getPrograms = AsyncHandler(async (req, res) => {
  //check if exists
  const programs = await Program.find();

  res.status(201).json({
    status: "success",
    message: "Programs fetched succesfully",
    data: programs,
  });
});

//  get single Program
//  router GET /api/v1/programs/:id
//  @access private
exports.getSingleProgram = AsyncHandler(async (req, res) => {
  //check if exists
  const singleProgram = await Program.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single program fetched succesfully",
    data: singleProgram,
  });
});

//  update single program
//  router PUT /api/v1/programs/:id
//  @access private
exports.updateProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check if name exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program Already Exists");
  }

  const singleProgram = await Program.findByIdAndUpdate(
    req.params.id,
    { name, description, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Single Program updated succesfully",
    data: singleProgram,
  });
});

//  delete single program
//  router DELETE /api/v1/programs/:id
//  @access private
exports.deleteProgram = AsyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program deleted successfully",
  });
});
