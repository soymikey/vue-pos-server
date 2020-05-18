const Router = require("koa-router");
const router = new Router();
const categoryController = require("../controller/category/category");

router.post("/get", categoryController.getCategories);
router.post("/add", categoryController.addCategory);
router.post("/delete", categoryController.deleteCategory);

module.exports = router;
