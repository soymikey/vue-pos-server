const Router = require("koa-router");
const router = new Router();
const userController = require("../controller/user/user");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/registerstaff", userController.registerStaff);
// router.get("/signout", Admin.signout);
// router.get("/all", Admin.getAllAdmin);
// router.get("/count", Admin.getAdminCount);
router.get("/info", userController.getUserInfo);
router.post("/getstaffs", userController.getStaffs);
router.post("/updateavatar/:userId", userController.updateAvatar);

// router.post("/update/avatar/:admin_id", Admin.updateAvatar);

module.exports = router;
