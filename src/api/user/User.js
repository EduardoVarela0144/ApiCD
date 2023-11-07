const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    rol: { type: Schema.Types.ObjectId, ref: 'Rol' },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    img: { type: String },
    linkedinURL: { type: String },
    email: { type: String, required: true },
    password: {type: String },
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
  },
  );

  UserSchema.pre("save", async function (next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;

      return next();
    } catch (error) {
      return next(error);
    }
  });

  
  module.exports = model("User", UserSchema);