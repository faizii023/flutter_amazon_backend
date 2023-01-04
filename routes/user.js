"use strict";
const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findById(id);
    let user = await User.findById(req.user);
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.toString() });
  }
});

userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.toString() });
  }
});

userRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { address } = req.body;
    console.log(address + "");
    let user = await User.findById(req.user);
    user.address = address;
    user = await user.save();
    //_v and ID
    res.json(user);
    console.log("Error occured");
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.toString() });
  }
});

//order product
userRouter.post("/api/order-product", auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;
    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i].product._id);

      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
        // console.log("Product",product);
       
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of Stock!` });
      }
    }
    console.log("Products",products);
    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();
    let order = new Order({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderAt: new Date().getTime(),
    });
    order = await order.save();
    console.log("Response",order)
    res.json(order);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.toString() });
  }
});

userRouter.get("/api/order/me", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    console.log(orders);
    res.json(orders);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.toString() });
  }
});
module.exports = userRouter;
