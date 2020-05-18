const ExtraModel = require("../../models/extra/extra");
const AddressComponent = require("../../prototype/addressComponent");
const moment = require("moment");

class ExtraCategory extends AddressComponent {
  //获取额外类目
  async getExtraCategories(ctx) {
    const { restaurantId } = ctx.request.body;

    if (!restaurantId || !Number(restaurantId)) {
      console.log("获取店铺详情参数ID错误");
      ctx.body = {
        status: 0,
        message: "店铺ID参数错误"
      };
      return;
    }
    try {
      const result = await ExtraModel.find({ restaurantId });
      ctx.body = {
        status: 1,
        data: result
      };
    } catch (err) {
      console.log("获取食品种类数据失败", err);
      ctx.body = {
        status: 0,
        message: "获取食品种类数据失败"
      };
    }
  }
  //添加额外类目
  async addExtraCategory(ctx) {
    const { restaurantId, name, description } = ctx.request.body;

    if (!restaurantId || !Number(restaurantId)) {
      console.log("获取店铺详情参数ID错误");
      ctx.body = {
        status: 0,
        message: "店铺ID参数错误"
      };
      return;
    }
    try {
      const newExtra = {
        extraCategoryId:
          new Date().valueOf() + Math.floor(Math.random() * 1000000),
        restaurantId,
        name,
        description,
        createdDate: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      const Extra = await ExtraModel.create(newExtra);
      ctx.body = {
        status: 1,
        message: "添加成功",
        data: Extra
      };
    } catch (err) {
      console.log("添加类目失败", err);
      ctx.body = {
        status: 0,
        message: "添加类目失败"
      };
    }
  }
  //删除类目
  async deleteExtraCategory(ctx) {
    const { extraCategoryId } = ctx.request.body;

    if (!extraCategoryId || !Number(extraCategoryId)) {
      ctx.body = {
        status: 0,
        message: "类目ID参数错误"
      };
      console.log("无效extraCategoryId");

      return;
    }
    try {
      // 删除food
      await ExtraModel.deleteOne({ extraCategoryId });
      ctx.body = {
        status: 1,
        message: "删除类目成功"
      };
    } catch (err) {
      ctx.body = {
        status: 0,
        message: "删除食品失败"
      };
    }
  }
}
module.exports = new ExtraCategory();
