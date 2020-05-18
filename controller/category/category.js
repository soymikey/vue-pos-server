const CategoryModel = require("../../models/category/category");
const AddressComponent = require("../../prototype/addressComponent");
const moment = require("moment");

class Category extends AddressComponent {
  constructor() {
    super();
    this.addCategory = this.addCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    // this.searchResaturant = this.searchResaturant.bind(this);
  }
  //获取类目  只用来后台添加食品的时候 需要的类目
  async getCategories(ctx) {
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
      const result = await CategoryModel.find({ restaurantId });
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
  //添加类目
  async addCategory(ctx) {
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
      const newCategory = {
        categoryId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
        restaurantId,
        name,
        description,
        createdDate: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      const category = await CategoryModel.create(newCategory);
      ctx.body = {
        status: 1,
        message: "添加成功",
        data: category
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
  async deleteCategory(ctx) {
    const { categoryId } = ctx.request.body;

    if (!categoryId || !Number(categoryId)) {
      ctx.body = {
        status: 0,
        message: "类目ID参数错误"
      };
      console.log("无效categoryId");

      return;
    }
    try {
      // 删除food
      await CategoryModel.deleteOne({ categoryId });
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
module.exports = new Category();
