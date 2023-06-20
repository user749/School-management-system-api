//with asynchandler we don't need try and catch blocks, this package will automatically send the error response
const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//  register admin
//  router POST /api/v1/admins/regster
//  @access private
exports.registerAdmCtrl = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    throw new Error("Admin Exists");
  } else {
    //register admin
    const user = await Admin.create({
      name,
      email,
      password: await hashPassword(password),
    });
    res.status(201).json({
      status: "success",
      date: user,
      message: "Admin Registered successfully",
    });
  }
});

//  login admin
//  router POST /api/v1/admins/login
//  @access private
exports.loginAdminCtrl = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find user
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.json({ message: "No user, Invalid login credentials" });
  }

  //verify password
  const isMatched = await isPassMatched(password, user.password);

  if (!isMatched) {
    return res.json({ message: "Invalid login credentials password" });
  } else {
    return res.json({
      data: generateToken(user._id),
      message: "Admin logged in successfully",
    });
  }
});

//@get all admins
exports.getAdminsCtrl = AsyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc     Get single admin
//@route    GET /api/v1/admins/:id
//@access   Private
exports.getAdminProfileCtrl = AsyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears")
    .populate("academicTerms")
    .populate("programs")
    .populate("yearGroups")
    .populate("classLevels");
  if (!admin) {
    throw new Error("Admin Not Found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin profile fatched successfully",
    });
  }
});

//  update single admin
//  router PUT /api/v1/admins/:id
//  @access private
exports.updateSingleAdminCtrl = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  //if email is taken
  const emailExist = await Admin.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //check if the user is updating the password
  if (password) {
    //update
    const admin = await Admin.findByIdAndUpdate(
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
      data: admin,
      message: "Admin passowrd updated successfully",
    });
  } else {
    //update
    const admin = await Admin.findByIdAndUpdate(
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
      data: admin,
      message: "Admin updated successfully",
    });
  }
});

//  delete single admin
//  router DELETE /api/v1/admins/:id
//  @access private
exports.deleteSingleAdminCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "delete admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  suspend a teacher
//  router PUT /api/v1/admins/suspend/teacher/:id
//  @access private
exports.suspendTeacherCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  unsuspend teacher
//  router PUT /api/v1/admins/unsuspend/teacher/:id
//  @access private
exports.unsuspendTeacherCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "unsuspending teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  withdraw a teacher
//  router PUT /api/v1/admins/withdraw/teacher/:id
//  @access private
exports.withdrawTeacherCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "admin witdhrawing teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  unwithdraw a teacher
//  router PUT /api/v1/admins/unwithdraw/teacher/:id
//  @access private
exports.unwithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "admin unwithdrawing teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  publish an exam
//  router PUT /api/v1/admins/publish/exam/:id
//  @access private
exports.examPublishCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "admin publish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//  unpublish an exam
//  router PUT /api/v1/admins/unpublish/exam/:id
//  @access private
exports.examUnpublishCtrl = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: "admin unpublish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
