const Router = require("koa-router");
const router = new Router();
const orderController = require("../controller/order/order");

router.post("/placeOrder", orderController.placeOrder);
router.post("/get", orderController.getOrders);
router.post("/delete", orderController.deleteOrder);
router.post("/count", orderController.countOrder);
router.post("/totalmoney", orderController.totalMoneyOrder);
// router.post("/delete", foodController.deletefood);

module.exports = router;
