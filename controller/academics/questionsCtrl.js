//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Question = require("../../model/Academic/Questions");

//  create Exam
//  router POST /api/v1/questions/:examID/
//  @access teacher only
exports.createQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  //find the exam
  const examFound = await Exam.findById(req.params.examID);
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //check if question exists
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    throw new Error("Question already exsists!");
  }

  //create exam
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.userAuth._id,
  });

  //add the question into exam
  examFound.questions.push(questionCreated?._id);

  //save
  await examFound.save();

  res.status(201).json({
    status: "success",
    message: "Question created",
    data: questionCreated,
  });
});

//  get all Questions
//  router Get /api/v1/questions/
//  @access teacher only
exports.getAllQuestions = AsyncHandler(async (req, res) => {
  //check if exists
  const questions = await Question.find();

  res.status(201).json({
    status: "success",
    message: "Questions fetched succesfully",
    data: questions,
  });
});

//  fetch single question
//  router GET /api/v1/questions/:questionID
//  @access private Teacher only
exports.getSingleQuestion = AsyncHandler(async (req, res) => {
  questionPresent = await Question.findById(req.params.id);

  if (!questionPresent) {
    throw new Error("Question doesn't exsist");
  }

  res.status(201).json({
    status: "success",
    message: "Single Question fetched succesfully",
    data: questionPresent,
  });
});

//  update single question
//  router PUT /api/v1/questions/:questionID
//  @access private Teacher Only
exports.updateSingleQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  //check if name exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    throw new Error("Question Already Exists");
  }

  const questionUpdate = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth?._id,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Single Question updated succesfully",
    data: questionUpdate,
  });
});
