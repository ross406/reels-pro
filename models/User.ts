import mongoose, { model, Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  // name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
