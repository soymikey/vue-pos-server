"use strict";

const userModel = require("../../models/user/user");
const AddressComponent = require("../../prototype/addressComponent");
const { encrypt, comparePassword } = require("../../lib/bcrypt");
const {
  createToken,
  checkAuth,
  decodeToken,
  decodeCaptcha
} = require("../../lib/token");
const moment = require("moment");

class Admin extends AddressComponent {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }
  async login(ctx) {
    const { username, password, captchaCode } = ctx.request.body;
    const captcha = decodeCaptcha(ctx);

    let response;
    try {
      if (!username) {
        ctx.body = {
          status: 0,
          message: "请填写用户名"
        };
        return;
      } else if (!password) {
        ctx.body = {
          status: 0,
          message: "请填写密码"
        };
        return;
      } else if (!captchaCode) {
        ctx.body = {
          status: 0,
          message: "请填写验证码"
        };
        return;
      } else if (captchaCode != captcha) {
        ctx.body = {
          status: 0,
          message: "验证码错误"
        };

        return;
      }
    } catch (err) {
      console.log(err.message, err);
      ctx.body = {
        status: 0,
        message: err.message
      };
      return;
    }

    // const newpassword = await encrypt(password);
    try {
      const user = await userModel.findOne({ username });

      if (!user) {
        console.log("用户不存在");
        ctx.body = {
          status: 0,
          message: "该用户不存在"
        };
      } else {
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          ctx.body = {
            status: 0,
            message: "密码输入错误"
          };
        } else {
          const token = createToken({
            username: user.username,
            userId: user.userId,
            auth: user.auth
          }); // 生成 token
          response = {
            status: 1,
            message: "登入成功",
            username: username,
            token: token
          };
          ctx.body = response;
        }
      }

      // else if (newpassword.toString() != user.password.toString()) {
      //   console.log("newpassword", newpassword);

      //   console.log("登录密码错误");
      //   ctx.body = {
      //     status: 0,
      //     message: "密码输入错误"
      //   };
      // } else {
      //   // req.session.userId = user.userId;
      //   // res.send({
      //   //   status: 1,
      //   //   success: "登录成功"
      //   // });
      //   const token = createToken({
      //     username: user.username,
      //     userId: user.userId,
      //     auth: user.auth
      //   }); // 生成 token
      //   response = {
      //     status: 1,
      //     message: "注册管理员成功",
      //     username: username,
      //     token: token
      //   };
      //   ctx.body = response;
      // }
    } catch (err) {
      console.log("登录失败", err);
      ctx.body = {
        status: 0,
        message: "登录失败"
      };
    }
  }

  async register(ctx) {
    const { username, password, captchaCode, auth = 2 } = ctx.request.body;
    const captcha = decodeCaptcha(ctx);

    let response;
    try {
      if (!username) {
        ctx.body = {
          status: 0,
          message: "请填写用户名"
        };
        return;
      } else if (!password) {
        ctx.body = {
          status: 0,
          message: "请填写密码"
        };
        return;
      } else if (!captchaCode) {
        ctx.body = {
          status: 0,
          message: "请填写验证码"
        };
        return;
      } else if (captchaCode != captcha) {
        ctx.body = {
          status: 0,
          message: "验证码错误"
        };

        return;
      }
    } catch (err) {
      console.log(err.message, err);
      ctx.body = {
        status: 0,
        message: err.message
      };
      return;
    }

    try {
      const user = await userModel.findOne({ username });
      if (user) {
        console.log("该用户已经存在");
        response = {
          status: 0,
          message: "该用户已经存在"
        };
        ctx.body = response;
      } else {
        const userId =
          new Date().valueOf() + Math.floor(Math.random() * 1000000);
        const restaurantId =
          new Date().valueOf() + Math.floor(Math.random() * 1000000);
        const newpassword = await encrypt(password);

        const newUser = {
          username,
          password: newpassword,
          userId,
          restaurantId,
          createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          auth
        };
        await userModel.create(newUser);
        const token = createToken({ username, userId, auth }); // 生成 token
        response = {
          status: 1,
          message: "注册管理员成功",
          username: username,
          token: token
        };
        ctx.body = response;
      }
    } catch (err) {
      console.log("注册管理员失败", err);
      response = {
        status: 0,
        type: "REGISTER_ADMIN_FAILED",
        message: "注册管理员失败"
      };
      ctx.body = response;
    }
  }
  async registerStaff(ctx) {
    // const { username, password } = ctx.request.body

    const {
      username,
      password,
      auth = 1,
      restaurantId,
      managerId
    } = ctx.request.body;
    let response;
    try {
      if (!username) {
        throw new Error("用户名错误");
      } else if (!password) {
        throw new Error("密码错误");
      }
    } catch (err) {
      console.log(err.message, err);
      response = {
        status: 0,
        message: err.message
      };
      ctx.body = response;
      return;
    }
    try {
      const user = await userModel.findOne({ username });
      if (user) {
        console.log("该用户名已经存在");
        response = {
          status: 0,
          message: "该用户名已经存在"
        };
        ctx.body = response;
      } else {
        const userId =
          new Date().valueOf() + Math.floor(Math.random() * 1000000);
        const newpassword = await encrypt(password);

        const newUser = {
          username,
          password: newpassword,
          userId,
          restaurantId,
          createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          auth,
          managerId
        };
        await userModel.create(newUser);
        response = {
          status: 1,
          message: "注册新员工成功"
        };
        ctx.body = response;
      }
    } catch (err) {
      console.log("注册新员工失败", err);
      response = {
        status: 0,
        message: "注册新员工失败"
      };
      ctx.body = response;
    }
  }

  async getUserInfo(ctx) {
    const isAuth = checkAuth(ctx);
    if (!isAuth) {
      ctx.body = { status: 0, message: "你还未登录" };
      return;
    } else {
      const { userId } = decodeToken(ctx);

      try {
        const info = await userModel.findOne(
          { userId: userId },
          { password: false }
        );
        if (!info) {
          throw new Error("未找到当前信息");
        } else {
          ctx.body = {
            status: 1,
            data: info
          };
        }
      } catch (err) {
        console.log("获取信息失败");
        ctx.body = {
          status: 0,
          type: "GET_ADMIN_INFO_FAILED",
          message: "获取信息失败"
        };
      }
    }
  }

  async getStaffs(ctx) {
    const { restaurantId } = ctx.request.body;

    if (!restaurantId || !Number(restaurantId)) {
      ctx.body = {
        status: 0,
        message: "无效参数restaurantId"
      };
      return;
    }
    try {
      const allStaff = await userModel.find({ restaurantId });
      ctx.body = {
        status: 1,
        data: allStaff,
        message: "获取员工列表成功"
      };
    } catch (err) {
      console.log("获取员工列表失败", err);
      res.send({
        status: 0,

        message: "获取员工列表失败"
      });
    }
  }
  async getAdminCount(req, res, next) {
    try {
      const count = await userModel.count();
      res.send({
        status: 1,
        count
      });
    } catch (err) {
      console.log("获取管理员数量失败", err);
      res.send({
        status: 0,
        type: "ERROR_GET_ADMIN_COUNT",
        message: "获取管理员数量失败"
      });
    }
  }

  async updateAvatar(ctx) {
    const userId = ctx.originalUrl.split("/").pop();

    if (!userId || !Number(userId)) {
      console.log("userId参数错误", userId);
      res.send({
        status: 0,
        message: "admin_id参数错误"
      });
      return;
    }
    const imagePath = await this.getPath(ctx);
    try {
      await userModel.findOneAndUpdate(
        { userId: userId },
        { $set: { avatar: imagePath } }
      );
      ctx.body = {
        status: 1,
        imagePath,
        message: "上传成功"
      };
    } catch (err) {
      console.log("上传图片失败", err);
      res.send({
        status: 0,
        type: "ERROR_UPLOAD_IMG",
        message: "上传图片失败"
      });
      return;
    }
  }
}

module.exports = new Admin();
