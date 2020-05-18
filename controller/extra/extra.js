const ExtraModel = require("../../models/extra/extra");
const AddressComponent = require("../../prototype/addressComponent");
const moment = require("moment");

class Extra extends AddressComponent {
  //获取额外
  async getExtras(ctx) {
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
      let count = 0;
      const extraMenu = await ExtraModel.find({ restaurantId });
      for (const category of extraMenu) {
        count += category.extras.length;
      }
      ctx.body = {
        status: 1,
        data: extraMenu,
        count
      };
    } catch (err) {
      console.log("获取额外种类数据失败", err);
      ctx.body = {
        status: 0,
        message: "获取额外种类数据失败"
      };
    }
  }
  //添加额外
  async addExtra(ctx) {
    const {
      name,
      extraCategoryId,
      restaurantId,
      description,
      price
    } = ctx.request.body;

    let extraCategory;
    try {
      extraCategory = await ExtraModel.findOne({ extraCategoryId });
    } catch (err) {
      console.log("获取食品类型和餐馆信息失败");
      ctx.body = {
        status: 0,
        message: "添加额外失败"
      };
      return;
    }

    const newExtra = {
      price,
      name,
      restaurantId,
      extraCategoryId,
      description,
      extraId: new Date().valueOf() + Math.floor(Math.random() * 1000000)
    };

    try {
      extraCategory.extras.push(newExtra);
      extraCategory.markModified("foods");
      await extraCategory.save();
      ctx.body = {
        status: 1,
        message: "添加成功"
      };
    } catch (err) {
      console.log("保存额外到数据库失败", err);
      ctx.body = {
        status: 0,
        message: "添加失败"
      };
    }
  }
  //更新
  async updateExtra(ctx) {
    const {
      extraCategoryId,
      extraId,
      name,
      newExtraCategoryId,
      description,
      price
    } = ctx.request.body;

    if (!extraCategoryId || !Number(extraCategoryId)) {
      console.log("获取类别参数ID错误");
      ctx.body = {
        status: 0,
        message: "类别ID参数错误"
      };
      return;
    }

    if (extraCategoryId === newExtraCategoryId) {
      try {
        await ExtraModel.findOneAndUpdate(
          { "extras.extraId": extraId },
          {
            $set: {
              "extras.$.name": name,
              "extras.$.price": price,
              "extras.$.description": description
            }
          }
        );
        ctx.body = {
          status: 1,
          message: "更新食品详情成功"
        };
      } catch (err) {
        console.log("更新食品详情失败");

        ctx.body = {
          status: 0,
          message: "更新食品失败"
        };
      }
    } else {
      ctx.body = {
        status: 0,
        message: "不支持此操作"
      };
    }
  }
  //更新额外上的位置
  async updateExtraPosition(ctx) {
    const {
      extraCategoryId,
      categoryName,
      extraId,
      name,
      newExtraCategoryId,
      newExtraId,
      restaurantAddress,
      restaurantId,
      restaurantName,
      description,
      price
    } = ctx.request.body;

    if (!extraCategoryId || !Number(extraCategoryId)) {
      console.log("获取类别参数ID错误");
      ctx.body = {
        status: 0,
        message: "类别ID参数错误"
      };
      return;
    }

    if (extraCategoryId === newExtraCategoryId) {
      try {
        // 获取放入数组的index
        const position = await ExtraModel.aggregate([
          { $match: { extraCategoryId } },
          {
            $project: {
              matchedIndex: { $indexOfArray: ["$extras.extraId", newExtraId] }
            }
          }
        ]);

        // 删除food
        await ExtraModel.update(
          { extraCategoryId },
          { $pull: { extras: { extraId } } }
        );

        const newExtra = {
          name,
          restaurantId,
          extraCategoryId,
          description,
          price,
          extraId: new Date().valueOf() + Math.floor(Math.random() * 1000000)
        };

        //添加new food到指定的位置的数组里

        await ExtraModel.update(
          {
            extraCategoryId
          },
          {
            $push: {
              extras: {
                $each: [newExtra],
                $position: position[0].matchedIndex
              }
            }
          }
        );

        ctx.body = {
          status: 1,
          message: "更新成功"
        };
      } catch (err) {
        console.log("更新食品到同类的类别失败");
        ctx.body = {
          status: 0,
          message: "更新食品失败"
        };
      }
    } else {
      try {
        const newExtra = {
          name,
          restaurantId,
          extraCategoryId: newExtraCategoryId,
          description,
          price,
          extraId: new Date().valueOf() + Math.floor(Math.random() * 1000000)
        };

        // 获取放入数组的index
        const position = await ExtraModel.aggregate([
          { $match: { extraCategoryId: newExtraCategoryId } },
          {
            $project: {
              matchedIndex: { $indexOfArray: ["$extras.extraId", newExtraId] }
            }
          }
        ]);

        // 删除food
        await ExtraModel.update(
          { extraCategoryId },
          { $pull: { extras: { extraId } } }
        );
        //添加new food到指定的位置的数组里
        await ExtraModel.update(
          {
            extraCategoryId: newExtraCategoryId
          },
          {
            $push: {
              extras: {
                $each: [newExtra],
                $position: position[0].matchedIndex
              }
            }
          }
        );
        ctx.body = {
          status: 1,
          message: "更新成功"
        };
      } catch (err) {
        console.log("更新食品到不同类的类别失败");

        ctx.body = {
          status: 0,
          message: "更新食品失败"
        };
      }
    }
  }
  //删除额外
  async deleteExtra(ctx) {
    const { extraId } = ctx.request.body;
    if (!extraId || !Number(extraId)) {
      ctx.body = {
        status: 0,
        message: "删除失败f"
      };
      console.log("无效extraId");

      return;
    }
    try {
      // 删除food
      await ExtraModel.update(
        { "extras.extraId": extraId },
        { $pull: { extras: { extraId } } }
      );
      ctx.body = {
        status: 1,
        message: "删除成功"
      };
    } catch (err) {
      ctx.body = {
        status: 0,
        message: "删除食品失败"
      };
    }
  }
}

module.exports = new Extra();
