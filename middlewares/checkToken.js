const { TOKEN_SECRET, TOKEN_EXPIRESIN } = require("../config");
const koaJwt = require("koa-jwt");

module.exports = koaJwt({ secret: TOKEN_SECRET }).unless({
  // return true 需要被授权
  custom: ctx => {
    // 定义白名单 即需要 token 的请求
    // 1 文章 增删改需要 token
    // 2 用户操作需要 token 评论之类的
    // const requireList = [/article\/(create|update|delete)/, /user/]
    
    // // 如果是被保护的url 就返回false 其他返回true
    // return !requireList.find(reg => reg.test(ctx.request.url));
    // const requireList = [/api\/(create|update|delete)/, /api/]
    const requireList = [/api\/restaurant/,/api\/category/,/api\/extracategory/,/api\/extra/,/api\/food/,/api\/order/];
        // 如果是被保护的url 就返回false 其他返回true
        return !requireList.find(reg => reg.test(ctx.request.url))
  }
});
