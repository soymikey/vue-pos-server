const Router = require("koa-router");
const router = new Router();
const captchaController = require("../controller/captcha/captcha");

router.get("/get", captchaController.getCaptcha);

module.exports = router;
