"use strict";

const captchapng = require("captchapng");
const { createToken } = require("../../lib/token");
class Captchas {
  constructor() {}
  //验证码
  async getCaptcha(ctx) {
    const code = parseInt(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, code);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    const base64 = p.getBase64();

    ctx.body = {
      status: 1,
      data: "data:image/png;base64," + base64,
      code: createToken({ code: code })
    };
  }
}

module.exports = new Captchas();
