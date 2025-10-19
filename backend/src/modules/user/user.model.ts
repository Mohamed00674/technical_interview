import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "viewer" | "editor" | "creator";

export interface IUser extends Document {
  username: string;
  password: string;
  fullname: string;
  avatar?: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    roles: [
      {
        type: String,
        enum: ["admin", "viewer", "editor", "creator"],
        default: ["viewer"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = model<IUser>("User", userSchema);
export default User;
