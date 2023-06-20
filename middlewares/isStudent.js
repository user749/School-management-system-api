const Student = require("../model/Academic/Student");

const isStudent = async (req, res, next) => {
  //find the student
  const userId = req?.userAuth?._id;
  const studentFound = await Student.findById(userId);

  //check if student
  if (studentFound?.role === "student") {
    next();
  } else {
    next(new Error("Access Denied, students only"));
  }
};

module.exports = isStudent;
