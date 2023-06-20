//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc Admin Register Student
//@route POST /api/v1/students/admin/register
//@access Private Admin Only
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if teacher already exists
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error("Student already Exists/registered");
  }

  //Hash password
  const hashedPassword = await hashPassword(password);

  //create
  const studentCreated = await Student.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "Student registered sccuessfully",
    data: studentCreated,
  });
});

//@desc Login a student
//@route POST /api/v1/students/login/
//@access Public
exports.loginStudent = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ message: "Invalid Login credentials" });
  }

  //verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid Login credentials" });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      data: generateToken(student?._id),
    });
  }
});

//@desc Student Profile
//@route GET /api/v1/students/profile
//@access Private Students Only
exports.getStudentsProfile = AsyncHandler(async (req, res) => {
  const students = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    .populate("examResults");
  if (!students) {
    throw new Error("Students not found");
  }
  // get student profile
  const studentProfile = {
    name: students?.name,
    email: students?.emai,
    currentClassLevel: students?.currentClassLevel,
    program: students?.program,
    dateAdmitted: students?.dateAdmitted,
    isSuspended: students?.isSuspended,
    isWithdrawn: students?.isWithdrawn,
    studentId: students?.studentId,
  };
  // get student exam result
  const examResults = students?.examResults;
  const currentExamResults = examResults[examResults.length - 1];
  //check if exam is published
  const isPublished = currentExamResults?.isPublished;

  //send response
  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
      currentExamResults: isPublished ? currentExamResults : [],
    },
    message: "Students Profile Fetched Successfully",
  });
});

//@desc Get all students
//@route GET /api/v1/students/admin
//@access Private admin
exports.getAllStudentsAdmin = AsyncHandler(async (req, res) => {
  const students = await Student.find();

  res.status(200).json({
    status: "success",
    message: "Students fetched successfully",
    data: students,
  });
});

//@desc Get single student by admin
//@route GET /api/v1/students/:studentID/admin
//@access Private Admin
exports.getSingleStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentID = req.params.studentID;

  //find the student
  const student = await Student.findById(studentID);

  if (!student) {
    throw new Error("Student doesn't exsist");
  }

  res.status(200).json({
    status: "success",
    message: "Single student fetched successfully",
    data: student,
  });
});

//@desc student updating profile
//@route PUT /api/v1/students/update
//@access Private Teacher Only
exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //check if the user is updating the password
  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student passowrd updated successfully",
    });
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  }
});

//@desc Admin updating students
//@route PUT /api/v1/students/:studentID/update/admin
//@access Private admin
exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    perfectName,
    isSuspended,
    isWithdrawn,
  } = req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //update the student
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        perfectName,
        isSuspended,
        isWithdrawn,
      },
      $addToSet: { classLevels: classLevels },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated successfully",
  });
});

//@desc Student Taking Exam
//@route POST /api/v1/students/exam/:examID/write
//@access Private Student Only
exports.writeExam = AsyncHandler(async (req, res) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //Get exam
  const examFound = await Exam.findById(req.params.examID)
    .populate("questions")
    .populate("academicTerm");
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //get questions
  const questions = examFound?.questions;

  //get student questions
  const studentAnswers = req.body.answers;

  //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("You have not answered all the questions");
  }

  //check if student has already taken the exams
  const studentFoundResults = await ExamResult.findOne({
    student: studentFound?._id,
  });
  if (studentFoundResults) {
    throw new Error("You cannot take the same exam twice");
  }

  //check if student is suspended
  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    throw new Error("You are suspended/withdrawn, you cannot take the exam");
  }

  //Build report object
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let status = ""; //failed or passed
  let totalQuestions = 0;
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];
  let remarks = "";

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctAnswers++;
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }

  //caluclate reports
  totalQuestions = questions.length;
  grade = (correctAnswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctanswer: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate the status
  if (grade >= 50) {
    status = "Passed";
  } else {
    status = "Failed";
  }

  // Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Sufficient";
  } else {
    remarks = "Poor";
  }

  //generate exam result
  const examResults = await ExamResult.create({
    studentID: studentFound?.studentId,
    exam: examFound?._id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.classLevel,
    academicYear: examFound?.academicYear,
    answeredQuestions: answeredQuestions,
  });
  //push the results into student db and save
  studentFound.examResults.push(examResults?._id);
  await studentFound.save();

  //Promoting students
  if (
    examFound.academicTerm.name === "1st term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    //promote student to level 200
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    await studentFound.save();
  }
  if (
    examFound.academicTerm.name === "2nd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    //promote student to level 300
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    await studentFound.save();
  }
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    //promote student to level 400
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    await studentFound.save();
  }

  //promote student to graduate
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  //send the response
  res.status(200).json({
    status: "success",
    data: "You have submitted your exam. Check later for the results.",
  });
});
