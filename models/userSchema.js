const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your full name!"],
    maxlength: [
      50,
      "Full Name is too long. Please enter at most 50 characters!",
    ],
    minlength: [
      2,
      "Full Name is too short. Please enter at least 2 characters!",
    ],
    trim: true,
    validate: {
      validator: function (v) {
        return /^(?!\s+$)[A-Za-z\s']+$/.test(v);
      },
      message:
        "Invalid full name. It should not contain only spaces, special characters, or numbers!",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter your email address!"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address!",
    },
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter your phone number!"],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}/.test(v);
      },
      message: "Please enter a valid 10-digit number!",
    },
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    /*validate: {
      validator: function (v) {
        return /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/.test(
          v
        );
      },
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character!",
    },*/
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password!"],
  },
  cartDetails: {
    products: [
      {
        productId: {
          type: String,
        },
        name: {
          type: String,
        },
        category: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        status: {
          type: String,
        },
        description: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  sentMessages: [
    {
      fullName: {
        type: String,
        required: [true, "Please enter your full name!"],
        maxlength: [
          50,
          "Full Name is too long. Please enter at most 50 characters!",
        ],
        minlength: [
          2,
          "Full Name is too short. Please enter at least 2 characters!",
        ],
        trim: true,
        validate: {
          validator: function (v) {
            return /^(?!\s+$)[A-Za-z\s']+$/.test(v);
          },
          message:
            "Invalid full name. It should not contain only spaces, special characters, or numbers!",
        },
      },
      email: {
        type: String,
        required: [true, "Please enter your email address!"],
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Please enter a valid email address!",
        },
      },
      subject: {
        type: String,
      },
      message: {
        type: String,
        required: [true, "Please enter your message!"],
      },
    },
  ],
  shippingDetails: [
    {
      address: {
        type: String,
        required: [true, "Please enter your address!"],
      },
      city: {
        type: String,
        required: [true, "Please enter your city!"],
      },
      pincode: {
        type: Number,
        required: [true, "Please enter your pin code!"],
      },
      phoneNumber: {
        type: Number,
        required: [true, "Please enter your phone number!"],
        validate: {
          validator: function (v) {
            return /^[0-9]{10}/.test(v);
          },
          message: "Please enter a valid 10-digit number!",
        },
      },
      country: {
        type: String,
        required: [true, "Please enter your country!"],
      },
      state: {
        type: String,
        required: [true, "Please enter your state!"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.methods.message = async function (messageDetails) {
  this.sentMessages = this.sentMessages.concat(messageDetails);
  await this.save();
};

const User = mongoose.model("user", userSchema);

module.exports = User;
