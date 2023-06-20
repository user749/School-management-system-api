const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Academic/Teacher");
const Exam = require("../../model/Academic/Exam");

//  @desc Create Exam
//  router POST /api/v1/exams
//  @access Private Teacher Only
exports.createExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
    createdBy,
  } = req.body;

  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new Error("Exam already exists");
  }

  //create
  const examCreated = new Exam({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    createdBy,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
    createdBy: req.userAuth?._id,
  });

  //push the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);
  //save exam
  await examCreated.save();
  await teacherFound.save();

  res.status(201).json({
    status: "success",
    message: "Exam Created",
    data: examCreated,
  });
});

//  get all Exams
//  router GET /api/v1/exams
//  @access private Teacher only
exports.getAllExams = AsyncHandler(async (req, res) => {
  //check if exists
  const exams = await Exam.find().populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });

  res.status(201).json({
    status: "success",
    message: "Exams fetched succesfully",
    data: exams,
  });
});

//  fetch single Exam
//  router GET /api/v1/exams/:examID
//  @access private Teacher only
exports.getSingleExam = AsyncHandler(async (req, res) => {
  examPresent = await Exam.findById(req.params.id);

  if (!examPresent) {
    throw new Error("Exam doesnt exsists");
  }

  res.status(201).json({
    status: "success",
    message: "Single Exam fetched succesfully",
    data: examPresent,
  });
});

//  update single Exam
//  router PUT /api/v1/exams/:id
//  @access private Teacher Only
exports.updateSingleExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
    createdBy,
  } = req.body;

  //check if name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("Exam Already Exists");
  }

  const examUpdate = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      academicYear,
      classLevel,
      createdBy,
      duration,
      examDate,
      examTime,
      examType,
      subject,
      program,
      createdBy: req.userAuth?._id,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Single Exam updated succesfully",
    data: examUpdate,
  });
});
