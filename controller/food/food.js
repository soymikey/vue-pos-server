const FoodModel = require("../../models/food/food");
const CategoryModel = require("../../models/category/category");
const AddressComponent = require("../../prototype/addressComponent");
const moment = require("moment");

class Category extends AddressComponent {
  // constructor() {
  //   super();
  //   this.addFood = this.addFood.bind(this);

  // }

  //添加食品
  async addFood(ctx) {
    const {
      name,
      specs,
      categoryId,
      restaurantId,
      description
    } = ctx.request.body;

    let category;
    let restaurant;
    try {
      category = await CategoryModel.findOne({ categoryId });
    } catch (err) {
      console.log("获取食品类型和餐馆信息失败");
      ctx.body = {
        status: 0,
        message: "添加食品失败"
      };
      return;
    }

    const newFood = {
      name,
      restaurantId,
      categoryId,
      description,
      foodId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
      specfoods: []
    };
    for (const spec of specs) {
      newFood.specfoods.push({
        // originalPrice: spec.price,
        foodName: name,
        specsId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
        price: spec.price,
        specsName: spec.specs
      });
    }

    try {
      await FoodModel.create(newFood);
      category.foods.push(newFood);
      category.markModified("foods");
      await category.save();
      ctx.body = {
        status: 1,
        message: "添加食品成功"
      };
    } catch (err) {
      console.log("保存食品到数据库失败", err);
      ctx.body = {
        status: 0,
        message: "添加食品失败"
      };
    }
  }
  //更新食品
  async updateFood(ctx) {
    const {
      categoryId,
      categoryName,
      foodId,
      name,
      newCategoryId,
      restaurantAddress,
      restaurantId,
      restaurantName,
      specfoods,
      description,
      specs
    } = ctx.request.body;
    let specfoodsArray = [];

    if (!categoryId || !Number(categoryId)) {
      console.log("获取类别参数ID错误");
      ctx.body = {
        status: 0,
        message: "类别ID参数错误"
      };
      return;
    }

    if (categoryId === newCategoryId) {
      for (const spec of specs) {
        specfoodsArray.push({
          // originalPrice: spec.price,
          foodName: name,
          specsId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
          price: spec.price,
          specsName: spec.specs
        });
      }
      try {
        await CategoryModel.findOneAndUpdate(
          { "foods.foodId": foodId },
          {
            $set: {
              "foods.$.name": name,
              "foods.$.description": description,
              "foods.$.specfoods": specfoodsArray
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
  //更新食品在菜单上的位置
  async updateFoodPosition(ctx) {
    const {
      categoryId,
      categoryName,
      foodId,
      name,
      newCategoryId,
      newFoodId,
      restaurantAddress,
      restaurantId,
      restaurantName,
      specfoods,
      description,
      specs
    } = ctx.request.body;
    let specfoodsArray = [];

    if (!categoryId || !Number(categoryId)) {
      console.log("获取类别参数ID错误");
      ctx.body = {
        status: 0,
        message: "类别ID参数错误"
      };
      return;
    }

    if (categoryId === newCategoryId) {
      try {
        // 获取放入数组的index
        const position = await CategoryModel.aggregate([
          { $match: { categoryId } },
          {
            $project: {
              matchedIndex: { $indexOfArray: ["$foods.foodId", newFoodId] }
            }
          }
        ]);

        // 删除food
        await CategoryModel.update(
          { categoryId },
          { $pull: { foods: { foodId } } }
        );

        const newFood = {
          name,
          restaurantId,
          categoryId,
          description,
          foodId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
          specfoods: []
        };
        for (const spec of specs) {
          newFood.specfoods.push({
            // originalPrice: spec.price,
            foodName: name,
            specsId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
            price: spec.price,
            specsName: spec.specs
          });
        }
        //添加new food到指定的位置的数组里

        await CategoryModel.update(
          {
            categoryId
          },
          {
            $push: {
              foods: {
                $each: [newFood],
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
        const newFood = {
          name,
          restaurantId,
          categoryId: newCategoryId,
          description,
          foodId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
          specfoods: []
        };
        for (const spec of specs) {
          newFood.specfoods.push({
            foodName: name,
            specsId: new Date().valueOf() + Math.floor(Math.random() * 1000000),
            price: spec.price,
            specsName: spec.specs
          });
        }
        console.log("newFood", newFood);

        // 获取放入数组的index
        const position = await CategoryModel.aggregate([
          { $match: { categoryId: newCategoryId } },
          {
            $project: {
              matchedIndex: { $indexOfArray: ["$foods.foodId", newFoodId] }
            }
          }
        ]);
        console.log("position", position);

        // 删除food
        await CategoryModel.update(
          { categoryId },
          { $pull: { foods: { foodId } } }
        );
        //添加new food到指定的位置的数组里
        await CategoryModel.update(
          {
            categoryId: newCategoryId
          },
          {
            $push: {
              foods: {
                $each: [newFood],
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
      // const targetCategory = await CategoryModel.findOne({
      //   categoryId: newCategoryId
      // });
      // try {
      //   await FoodModel.create(newFood);
      //   targetCategory.foods.push(newFood);

      //   targetCategory.markModified("foods");
      //   await targetCategory.save();
      //   // 删除原始类目的食物

      //   await CategoryModel.update(
      //     { categoryId },
      //     { $pull: { foods: { foodId } } }
      //   );

      //   ctx.body = {
      //     status: 1,
      //     message: "更新成功"
      //   };
      // } catch (err) {
      //   console.log("更新失败", err);
      //   ctx.body = {
      //     status: 0,
      //     message: "更新失败"
      //   };
      // }
    }
  }
  //删除菜单上的食品
  async deleteFood(ctx) {
    const { foodId } = ctx.request.body;
    if (!foodId || !Number(foodId)) {
      ctx.body = {
        status: 0,
        message: "删除失败f"
      };
      console.log("无效foodId");

      return;
    }
    try {
      // 删除food
      await CategoryModel.update(
        { "foods.foodId": foodId },
        { $pull: { foods: { foodId } } }
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
module.exports = new Category();
