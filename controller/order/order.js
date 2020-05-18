const FoodModel = require("../../models/food/food");
const OrderModel = require("../../models/order/order");
const AddressComponent = require("../../prototype/addressComponent");
const moment = require("moment");

class Order extends AddressComponent {
  constructor() {
    super();
    this.placeOrder = this.placeOrder.bind(this);
    // this.deleteCategory = this.deleteCategory.bind(this);
    // this.searchResaturant = this.searchResaturant.bind(this);
  }
  //获取订单
  async getOrders(ctx) {
    const { restaurantId, limit = 0, offset = 0 } = ctx.request.body;

    if (!restaurantId || !Number(restaurantId)) {
      ctx.body = { status: 0, message: "user_id参数错误" };
      return;
    } else if (!Number(limit)) {
      ctx.body = { status: 0, message: "limit参数错误" };
      return;
    } else if (typeof Number(offset) !== "number") {
      ctx.body = { status: 0, message: "offset参数错误" };
      return;
    }
    try {
      const ordersCount = await OrderModel.find({
        restaurantId
      }).count();
      const orders = await OrderModel.find({ restaurantId })
        .sort({ orderTime: -1 })
        .limit(Number(limit))
        .skip(Number(offset));
      ctx.body = {
        status: 1,
        data: orders,
        count: ordersCount
      };
    } catch (err) {
      console.log("获取订单列表失败", err);
      ctx.body = {
        status: 0,
        message: "获取订单列表失败"
      };
    }
  }

  //添加订单
  async placeOrder(ctx) {
    const {
      userId,
      restaurantId,
      restaurantName,
      cartId,
      totalPrice,
      totalQuantity,
      entities,
      address,
      userName,
      description
    } = ctx.request.body;

    if (!(entities instanceof Array) || !entities.length) {
      ctx.body = { status: 0, message: "entities参数错误" };
      return;
    } else if (!address) {
      ctx.body = { status: 0, message: "address_id参数错误" };
      return;
    } else if (!userId || !Number(userId)) {
      ctx.body = { status: 0, message: "user_id参数错误" };
      return;
    } else if (!cartId || !Number(cartId)) {
      ctx.body = { status: 0, message: "cart_id参数错误" };
      return;
    } else if (!restaurantId || !Number(restaurantId)) {
      ctx.body = { status: 0, message: "restaurantId参数错误" };
      return;
    }

    const orderObj = {
      basket: {
        group: entities
      },
      restaurantId,
      restaurantName,
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      orderId: cartId,
      totalAmount: totalPrice,
      totalQuantity,
      address,
      description: description,
      userInfo: {
        userId: userId,
        userName: userName
      }
    };
    try {
      await OrderModel.create(orderObj);
      ctx.body = {
        status: 1,
        message: "下单成功"
      };
    } catch (err) {
      console.log("保存订单数据失败");
      ctx.body = {
        status: 0,
        message: "订单失败"
      };
    }
    // ctx.body = {
    //   status: 1,
    //   message: ctx.request.body
    // };
  }
  //删除订单
  async deleteOrder(ctx) {
    const { orderId } = ctx.request.body;
    if (!orderId || !Number(orderId)) {
      ctx.body = {
        status: 0,
        message: "删除失败"
      };
      console.log("无效orderId");
      return;
    }

    try {
      // 删除food
      await OrderModel.remove({ orderId });
      ctx.body = {
        status: 1,
        message: "删除成功"
      };
    } catch (err) {
      console.log("删除订单失败");
      ctx.body = {
        status: 0,
        message: "删除食品失败"
      };
    }
  }
  //countOrder
  async countOrder(ctx) {
    const { date, restaurantId } = ctx.request.body;

    if (!restaurantId) {
      ctx.body = { status: 0, message: "restaurantId参数错误" };
      return;
    } else if (!date) {
      ctx.body = {
        status: 0,
        message: "获取今日订单失败"
      };
      console.log("无效date");
      return;
    }

    try {
      //查找特定日期订单
      const result = await OrderModel.find({
        createdDate: eval("/" + date + "/gi"),
        restaurantId
      }).count();

      ctx.body = {
        status: 1,
        data: result,
        message: "获取今日订单成功"
      };
    } catch (err) {
      console.log("获取今日订单失败");
      ctx.body = {
        status: 0,
        message: "获取今日订单失败"
      };
    }
  }
  // 获取某日的营业额
  async totalMoneyOrder(ctx) {
    const { date, restaurantId } = ctx.request.body;
    if (!restaurantId) {
      ctx.body = { status: 0, message: "restaurantId参数错误" };
      return;
    } else if (!date) {
      ctx.body = {
        status: 0,
        message: "获取今日订单失败"
      };
      console.log("无效date");
      return;
    }

    try {
      //查找特定日期订单
      const result = await OrderModel.aggregate([
        {
          $match: {
            restaurantId,
            createdDate: eval("/" + date + "/gi")
          }
        },
        {
          $group: {
            _id: null,
            totalPrice: {
              $sum: "$totalAmount"
            }
          }
        }
      ]);

      ctx.body = {
        status: 1,
        data: result[0].totalPrice,
        message: "获取今日营业额成功"
      };
    } catch (err) {
      console.log("获取今日营业额失败");
      ctx.body = {
        status: 1,
        data: 0,
        message: "获取今日营业额成功"
      };
    }
  }
}
module.exports = new Order();
