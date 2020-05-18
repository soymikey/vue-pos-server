const isDev = process.env.NODE_ENV === "development";

module.exports = {
  SALT_WORK_FACTOR: 10, // 生成salt的迭代次数
  TOKEN_SECRET: "secret-key",
  TOKEN_EXPIRESIN: "24h", // token 有效期
  WEB_HOST: isDev ? "localhost:3000" : "http://pos.migaox.com", // 主机地址（端口）
  DB: isDev
    ? "mongodb://pos:pos335829832@34.84.145.207:3011/pos"
    : "mongodb://dbBaseName:dbPassword@localhost:19999/pos",
};
