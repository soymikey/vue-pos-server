const Koa = require("koa");
const cors = require("koa2-cors");
const logger = require("koa-logger");
const errorHandle = require("./middlewares/errorHandle");
const checkToken = require("./middlewares/checkToken");
const router = require("./router");
const app = new Koa();
const serve = require("koa-static");
const path = require("path");
const koaBody = require("koa-body");

//引入所有的模板和connect
const { connect, initSchemas } = require("./mongodbConnection/init.js");
//立即执行函数
(async () => {
  await connect();
  initSchemas();
  console.log("后端连接成功，模板建立成功");
})();
app.use(cors()).use(logger()).use(errorHandle).use(checkToken);
// .use(bodyParser());
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);

// app.use(router.routes(), router.allowedMethods())
router.use(router.routes());

app.use(serve(path.join(__dirname, "/public")));

app.use(router.routes()).use(router.allowedMethods());

app.listen(4001, () => {
  console.log("sever listen on http://127.0.0.1:4001");
});
