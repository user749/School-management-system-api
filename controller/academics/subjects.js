//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");

//  create Subject
//  router POST /api/v1/subjects/:programID
//  @access private
exports.createSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;

  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) {
    throw new Error("Program doesn't exist");
  }

  // check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exist");
  }

  // create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });

  //push to the program
  programFound.subjects.push(subjectCreated._id);
  //save
  await programFound.save();

  res.status(201).json({
    status: "success",
    message: "Subject created succesfully",
    data: subjectCreated,
  });
});

//  get all subjects
//  router GET /api/v1/subjects
//  @access private
exports.getSubjects = AsyncHandler(async (req, res) => {
  //check if exists
  const subjects = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "Subjects fetched succesfully",
    data: subjects,
  });
});

//  get single Subject
//  router GET /api/v1/subjects/:id
//  @access private
exports.getSingleSubject = AsyncHandler(async (req, res) => {
  //check if exists
  const singleSubject = await Subject.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Single subject fetched succesfully",
    data: singleSubject,
  });
});

//  update single subject
//  router PUT /api/v1/subjects/:id
//  @access private
exports.updateSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;

  //check if name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject Already Exists");
  }

  const singleSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    { name, description, academicTerm, createdBy: req.userAuth._id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Subject updated succesfully",
    data: singleSubject,
  });
});

//  delete single program
//  router DELETE /api/v1/subjects/:id
//  @access private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully",
  });
});
