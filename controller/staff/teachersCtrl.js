//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Teacher = require("../../model/Academic/Teacher");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc Admin Register Teacher
//@route POST /api/v1/teachers/admin/register/
//@access Private
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }

  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already Exists/registered");
  }

  //Hash password
  const hashedPassword = await hashPassword(password);

  //create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });

  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  res.status(201).json({
    status: "success",
    message: "Teacher registered sccuessfully",
    data: teacherCreated,
  });
});

//@desc Login a teacher
//@route POST /api/v1/teachers/admin/login/
//@access Public
exports.loginTeacher = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.json({ message: "Invalid Login credentials" });
  }

  //verify the password
  const isMatched = await isPassMatched(password, teacher?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid Login credentials" });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Teachers logged in successfully",
      data: generateToken(teacher?._id),
    });
  }
});

//@desc Get all Teacher
//@route GET /api/v1/teachers/admin
//@access Private
exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc Get single Teacher
//@route GET /api/v1/teachers/:teacherID/admin
//@access Private
exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherID = req.params.teacherID;

  //find the teacher
  const teachers = await Teacher.findById(teacherID);

  if (!teachers) {
    throw new Error("Teacher doesn't exsist");
  }

  res.status(200).json({
    status: "success",
    message: "Single teachers fetched successfully",
    data: teachers,
  });
});

//@desc Teacher Profile
//@route GET /api/v1/teachers/:teacherID/profile
//@access Private Teacher Only
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher Profile Fetched Successfully",
  });
});

//@desc Teacher updating profile admin
//@route PUT /api/v1/teachers/:teacherID/update
//@access Private Teacher Only
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //check if the user is updating the password
  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher passowrd updated successfully",
    });
  } else {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher updated successfully",
    });
  }
});

//@desc     Admin updating Teacher profile
//@route    UPDATE /api/v1/teachers/:teacherID/admin
//@access   Private Admin only

exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }
  //Check if teacher is withdrawn
  if (teacherFound.isWitdrawn) {
    throw new Error("Action denied, teacher is withdraw");
  }
  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Academic year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }
});
