const Router = require("koa-router");
const router = new Router();
const extraCategoryController = require("../controller/extraCategory/extraCategory");

router.post("/get", extraCategoryController.getExtraCategories);
router.post("/add", extraCategoryController.addExtraCategory);
router.post("/delete", extraCategoryController.deleteExtraCategory);

module.exports = router;
