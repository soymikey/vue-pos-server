const { TOKEN_SECRET, TOKEN_EXPIRESIN } = require("../config/index");
const jwt = require("jsonwebtoken");

exports.createToken = info => {
  const token = jwt.sign(info, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRESIN });
  return token;
};

const decodeToken = ctx => {
  const authorizationHeader = ctx.headers["authorization"];

  const token = authorizationHeader.split(" ")[1]; // 取到 token
  return jwt.decode(token);
};
const decodeCaptcha = ctx => {
  const captchaHeader = ctx.headers["captcha"];

  const cap = captchaHeader.split(" ")[1]; // 取到 captcha

  return jwt.decode(cap).code;
  // return jwt.decode(token);
};

exports.decodeToken = decodeToken;
exports.decodeCaptcha = decodeCaptcha;

// 检查权限 权限 1 为博主~
exports.checkAuth = ctx => {
  const authorizationHeader = ctx.headers["authorization"];

  if (!authorizationHeader) return false;
  const { auth } = decodeToken(ctx);
  if (auth !== 0) {
    return true;
  } else {
    // ctx.body = { code: 401, message: "您无权限进行此操作" };
    return false;
  }
};
