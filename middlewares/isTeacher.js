const Teacher = require("../model/Academic/Teacher");

const isTeacher = async (req, res, next) => {
  //find the user
  const userId = req?.userAuth?._id;
  const teacherFound = await Teacher.findById(userId);

  //check if admin
  if (teacherFound?.role === "teacher") {
    next();
  } else {
    next(new Error("Access Denied, teachers only"));
  }
};

module.exports = isTeacher;
