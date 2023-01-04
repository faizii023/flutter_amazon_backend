const mongoose = require("mongoose");
const { productSchema } = require("./product");
const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (val) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return val.match(re);
      },
      message: "Please enter a valid address",
    },
  },
  password: {
    require: true,
    type: String,
    // validate: {
    //     validator: (val) => {
    //     return val.length>6;
    //     },
    //     message: "Please enter a long password min 6",
    //   },
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },

  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
