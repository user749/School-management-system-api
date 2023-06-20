//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const ExamResult = require("../../model/Academic/ExamResults");

//@desc Exam Results checking
//@route GET /api/v1/exam-results/:id/checking
//@access Students only
exports.checkExamResults = AsyncHandler(async (req, res) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("No Student Found");
  }

  //find the exam results
  const examResults = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm");

  //check if exam is published
  if (examResults?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }

  res.status(200).json({
    status: "success",
    message: "Exam Result",
    data: examResults,
    student: studentFound,
  });
});

//@desc Get all exam results
//@route GET /api/v1/exam-results
//@access Teacher only
exports.getAllExamResults = AsyncHandler(async (req, res) => {
  const results = await ExamResult.find().select("exam").populate("exam");

  res.status(200).json({
    status: "success",
    message: "Exam results fetched",
    data: results,
  });
});

//@desc Admin publishing exam results
//@route PUT /api/v1/exam-results/:id/admin-toggle-publish
//@access Admin  only
exports.adminToggleExamResult = AsyncHandler(async (req, res) => {
  //find the exam result
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new Error("Requested Exam Results Doesn't Exist");
  }

  const publishResults = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Exam results Updated",
    data: publishResults,
  });
});
