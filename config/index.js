const isDev = process.env.NODE_ENV === "development";

module.exports = {
  SALT_WORK_FACTOR: 10, // 生成salt的迭代次数
  TOKEN_SECRET: "secret-key",
  TOKEN_EXPIRESIN: "24h", // token 有效期
  WEB_HOST: isDev ? "localhost:4000" : "http://pos.migaox.com", // 主机地址（端口）
  DB: isDev
    ? "mongodb://pos:pos335829832@49.235.133.74:27016/pos"
    : "mongodb://pos:pos335829832@49.235.133.74:27016/pos",
};
