const mongoose = require("mongoose");
const { OrderModel, CartModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

class ShoppingRepository {
  async Cart(customerId) {
    return await CartModel.findOne({ customerId });
  }

  async ManageCart(customerId, product, qty, isRemove) {
    const cart = await CartModel.findOne({ customerId });
    if (cart) {
      if (isRemove) {
        const cartItems = _.filter(
          cart.items,
          (item) => item.product._id !== product._id
        );
        cart.items = cartItems;
      } else {
        const cartIndex = _.findIndex(cart.items, {
          product: { _id: product._id },
        });
        if (cartIndex > -1) {
          cart.items[cartIndex].unit = qty;
        } else {
          cart.items.push({ product: { ...product }, unit: qty });
        }
      }
      return await cart.save();
    } else {
      // * create a new one
      return await CartModel.create({
        customerId,
        items: [{ product: { ...product }, unit: qty }],
      });
    }
  }

  async Orders(customerId) {
    const orders = await OrderModel.find({ customerId });

    return orders;
  }

  async CreateNewOrder(customerId, txnId) {
    const cart = await CartModel.findOne({ customerId: customerId });

    if (cart) {
      let amount = 0;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          amount += parseInt(item.product.price) * parseInt(item.unit);
        });

        const orderId = uuidv4();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          status: "received",
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    }

    return {};
  }
}

module.exports = ShoppingRepository;
