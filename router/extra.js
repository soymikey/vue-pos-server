const Router = require("koa-router");
const router = new Router();
const extraController = require("../controller/extra/extra");

router.post("/get", extraController.getExtras);
router.post("/add", extraController.addExtra);
router.post("/update", extraController.updateExtra);
router.post("/updateposition", extraController.updateExtraPosition);
router.post("/delete", extraController.deleteExtra);

module.exports = router;
