const Router = require("koa-router");
const router = new Router();
const foodController = require("../controller/food/food");

router.post("/add", foodController.addFood);
router.post("/update", foodController.updateFood);
router.post("/updateposition", foodController.updateFoodPosition);
router.post("/delete", foodController.deleteFood);
// router.post("/delete", foodController.deletefood);

module.exports = router;
