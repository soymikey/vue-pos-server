const Router = require("koa-router");
const router = new Router();
const restaurantController = require("../controller/restaurant/restaurant");

router.post("/info", restaurantController.getRestaurantInfo);
router.post("/add", restaurantController.addRestaurant);
router.post("/update", restaurantController.updateRestaurant);
router.post("/menu", restaurantController.getMenu);

module.exports = router;
