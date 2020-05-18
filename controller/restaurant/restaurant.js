"use strict";

const RestaurantModel = require("../../models/restaurant/restaurant");
const CategoryModel = require("../../models/category/category");
const AddressComponent = require("../../prototype/addressComponent");
// const Food=require( "./food")

// const CategoryHandle = require("./category");

class Restaurant extends AddressComponent {
  constructor() {
    super();
    this.addRestaurant = this.addRestaurant.bind(this);
    this.getRestaurantInfo = this.getRestaurantInfo.bind(this);
    // this.searchResaturant = this.searchResaturant.bind(this);
  }
  //添加商铺
  async addRestaurant(ctx) {
    const {
      name,
      address,
      description,
      phone,
      startTime,
      endTime,
      promotion_info,
      restaurantId,
      managerId
    } = ctx.request.body;
    let response;

    if (!name) {
      ctx.body = {
        status: 0,
        message: "必须填写商店名称"
      };
      return;
    } else if (!address) {
      ctx.body = {
        status: 0,
        message: "必须填写商店地址"
      };
      return;
    } else if (!phone) {
      ctx.body = {
        status: 0,
        message: "必须填写联系电话"
      };
      return;
    } else if (!startTime || !endTime) {
      ctx.body = {
        status: 0,
        message: "必须填写营业时间"
      };
      return;
    } else if (!restaurantId) {
      ctx.body = {
        status: 0,
        message: "无效店铺Id"
      };
      return;
    } else if (!managerId) {
      ctx.body = {
        status: 0,
        message: "请登入后再创建店铺"
      };
      return;
    }

    const exists = await RestaurantModel.findOne({ restaurantId });

    if (exists) {
      ctx.body = {
        status: 0,
        message: "您已经注册了店铺"
      };
      return;
    }
    const opening_hours =
      startTime && endTime ? startTime + "/" + endTime : "8:30/20:30";
    const newRestaurant = {
      managerId,
      name,
      address,
      description,
      restaurantId,
      opening_hours: [opening_hours],
      phone,
      promotion_info: promotion_info || "欢迎光临，用餐高峰请提前下单，谢谢"
    };
    try {
      //保存数据，并增加对应食品种类的数量
      const restaurant = new RestaurantModel(newRestaurant);
      await restaurant.save();

      ctx.body = {
        status: 1,
        message: "添加店铺成功",
        data: newRestaurant
      };
    } catch (err) {
      console.log("商铺写入数据库失败");
      ctx.body = {
        status: 0,
        message: "添加商铺失败"
      };
    }
  }
  //更新商铺
  async updateRestaurant(ctx) {
    const {
      name,
      address,
      description,
      phone,
      startTime,
      endTime,
      promotion_info,
      restaurantId,
      managerId
    } = ctx.request.body;
    if (!name) {
      ctx.body = {
        status: 0,
        message: "必须填写商店名称"
      };
      return;
    } else if (!address) {
      ctx.body = {
        status: 0,
        message: "必须填写商店地址"
      };
      return;
    } else if (!phone) {
      ctx.body = {
        status: 0,
        message: "必须填写联系电话"
      };
      return;
    } else if (!startTime || !endTime) {
      ctx.body = {
        status: 0,
        message: "必须填写营业时间"
      };
      return;
    } else if (!restaurantId) {
      ctx.body = {
        status: 0,
        message: "无效店铺Id"
      };
      return;
    } else if (!managerId) {
      ctx.body = {
        status: 0,
        message: "请登入后再创建店铺"
      };
      return;
    }
    const opening_hours =
      startTime && endTime ? startTime + "/" + endTime : "8:30/20:30";
    const newRestaurant = {
      managerId,
      name,
      address,
      description,
      restaurantId,
      opening_hours: [opening_hours],
      phone,
      promotion_info: promotion_info || "欢迎光临，用餐高峰请提前下单，谢谢"
    };
    try {
      await RestaurantModel.findOneAndUpdate({ restaurantId }, newRestaurant);

      const restaurant = await RestaurantModel.findOne({ restaurantId });
      ctx.body = {
        status: 1,
        message: "添加店铺成功",
        data: restaurant
      };
    } catch (err) {
      ctx.body = {
        status: 0,
        message: "添加商铺失败"
      };
    }

    //     await ShopModel.update({ id: fields.restaurantId }, newShop);

    //     await ShopModel.findOne({ id: fields.restaurantId }).then(result => {
    //       res.send({
    //         status: 1,
    //         sussess: "添加店铺成功",
    //         data: result
    //       });
    //     });
    //   } catch (err) {
    //     console.log("商铺写入数据库失败");
    //     res.send({
    //       status: 0,
    //       type: "ERROR_SERVER",
    //       message: "添加商铺失败"
    //     });
    //   }
    // });
  }

  //获取店铺详情
  async getRestaurantInfo(ctx) {
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
      const restaurant = await RestaurantModel.findOne({ restaurantId });
      if (restaurant) {
        ctx.body = {
          status: 1,
          message: "获取店铺详情成功",
          data: restaurant
        };
      } else {
        ctx.body = {
          status: 0,
          message: "请去管理页面,设置店铺信息",
          data: restaurant
        };
      }
    } catch (err) {
      console.log("获取店铺详情失败", err);
      ctx.body = {
        status: 0,
        message: "获取店铺详情失败"
      };
    }
  }
  //获取店铺菜单
  async getMenu(ctx) {
    const { restaurantId } = ctx.request.body;

    if (!restaurantId || !Number(restaurantId)) {
      console.log("获取店铺详情参数ID错误");
      ctx.body = {
        status: 0,
        message: "店铺ID参数错误"
      };
      return;
    }
    let filter = {
      restaurantId
      // $where: function() {
      //   return this.foods.length;
      // }
    };

    try {
      let count = 0;
      const menu = await CategoryModel.find(filter);
      for (const category of menu) {
        count += category.foods.length;
      }
      ctx.body = {
        status: 1,
        data: menu,
        count,
        message: "获取食品列表成功"
      };
    } catch (err) {
      console.log("获取食品数据失败", err);
      ctx.body = {
        status: 0,
        message: "获取食品数据失败"
      };
    }
  }
  async getShopCount(req, res, next) {
    try {
      const count = await ShopModel.count();
      res.send({
        status: 1,
        count
      });
    } catch (err) {
      console.log("获取店铺数量失败", err);
      res.send({
        status: 0,
        type: "ERROR_TO_GET_COUNT",
        message: "获取店铺数量失败"
      });
    }
  }
  async updateshop(req, res, next) {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("获取商铺信息form出错", err);
        res.send({
          status: 0,
          type: "ERROR_FORM",
          message: "表单信息错误"
        });
        return;
      }
      const {
        name,
        address,
        description = "",
        phone,
        category,
        id,
        latitude,
        longitude,
        image_path
      } = fields;
      if (id == 1) {
        res.send({
          status: 0,
          message: "此店铺用做展示，请不要修改"
        });
        return;
      }
      try {
        if (!name) {
          throw new Error("店铺名称错误");
        } else if (!address) {
          throw new Error("店铺地址错误");
        } else if (!phone) {
          throw new Error("店铺联系电话错误");
        } else if (!category) {
          throw new Error("店铺分类错误");
        } else if (!id || !Number(id)) {
          throw new Error("店铺ID错误");
        } else if (!image_path) {
          throw new Error("店铺图片地址错误");
        }
        let newData;
        if (latitude && longitude) {
          newData = {
            name,
            address,
            description,
            phone,
            category,
            latitude,
            longitude,
            image_path
          };
        } else {
          newData = { name, address, description, phone, category, image_path };
        }
        await ShopModel.findOneAndUpdate({ id }, { $set: newData });
        res.send({
          status: 1,
          success: "修改商铺信息成功"
        });
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: 0,
          type: "ERROR_UPDATE_RESTAURANT",
          message: "更新商铺信息失败"
        });
      }
    });
  }
  async deleteResturant(req, res, next) {
    const restaurant_id = req.params.restaurant_id;
    if (!restaurant_id || !Number(restaurant_id)) {
      console.log("restaurant_id参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "restaurant_id参数错误"
      });
      return;
    }
    if (restaurant_id == 1) {
      res.send({
        status: 0,
        message: "此店铺用做展示，请不要删除"
      });
      return;
    }
    try {
      await ShopModel.remove({ id: restaurant_id });
      res.send({
        status: 1,
        success: "删除店铺成功"
      });
    } catch (err) {
      console.log("删除店铺失败", err);
      res.send({
        status: 0,
        type: "DELETE_RESTURANT_FAILED",
        message: "删除店铺失败"
      });
    }
  }
}

module.exports = new Restaurant();
