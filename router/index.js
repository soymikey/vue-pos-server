const router = require("koa-router")();
const userRouter = require("./user");
const restaurantRouter = require("./restaurant");
const categoryRouter = require("./category");
const extraCategoryRouter = require("./extraCategory");
const extraRouter = require("./extra");
const foodRouter = require("./food");
const orderRouter = require("./order");
const captchaRouter = require("./captcha");

router.use("/api/user", userRouter.routes());
router.use("/api/restaurant", restaurantRouter.routes());
router.use("/api/category", categoryRouter.routes());
router.use("/api/extracategory", extraCategoryRouter.routes());
router.use("/api/extra", extraRouter.routes());
router.use("/api/food", foodRouter.routes());
router.use("/api/order", orderRouter.routes());
router.use("/api/captcha", captchaRouter.routes());

module.exports = router;
