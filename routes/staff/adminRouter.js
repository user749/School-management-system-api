const express = require("express");
const {
  registerAdmCtrl,
  loginAdminCtrl,
  getAdminsCtrl,
  getAdminProfileCtrl,
  updateSingleAdminCtrl,
  deleteSingleAdminCtrl,
  suspendTeacherCtrl,
  unsuspendTeacherCtrl,
  withdrawTeacherCtrl,
  unwithdrawTeacherCtrl,
  examPublishCtrl,
  examUnpublishCtrl,
} = require("../../controller/staff/adminCtrl");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const advancedResults = require("../../middlewares/advancedResults");
const Admin = require("../../model/Staff/Admin");
const isAuthenitcated = require("../../middlewares/isAuth");
const roleRestriction = require("../../middlewares/roleRestriction");
const adminRouter = express.Router();

//register
adminRouter.post("/register", registerAdmCtrl);

//login
adminRouter.post("/login", loginAdminCtrl);

//get all admins
adminRouter.get("/", isLogin, advancedResults(Admin), getAdminsCtrl);

//single admin
adminRouter.get(
  "/:id",
  isAuthenitcated(Admin),
  roleRestriction("admin"),
  getAdminProfileCtrl
);

//update admin
adminRouter.put("/", isLogin, isAdmin, updateSingleAdminCtrl);

//delete admin
adminRouter.delete("/:id", deleteSingleAdminCtrl);

//suspend teacher
adminRouter.put("/suspend/teacher/:id", suspendTeacherCtrl);

//unsuspend teacher
adminRouter.put("/unsuspend/teacher/:id", unsuspendTeacherCtrl);

//withdraw admin
adminRouter.put("/withdraw/teacher/:id", withdrawTeacherCtrl);

//unwithdraw admin
adminRouter.put("/unwithdraw/teacher/:id", unwithdrawTeacherCtrl);

//admin publish exam
adminRouter.put("/publish/exam/:id", examPublishCtrl);

//unpublish exam
adminRouter.put("/unpublish/exam/:id", examUnpublishCtrl);

module.exports = adminRouter;
