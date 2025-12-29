import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import customError from "../utils/ErrorHandling.js";
dotenv.config();

class userService {
  async createUser(name, email, password, age, role) {
    if (!name || !email || !password || !age || !role)
      throw new customError("All fields are required", 400);
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new customError("User already exists", 409);

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
      role,
      age,
    });
    return await user.save();
  }

  async login(email, password) {
    if (!email || !password) {
      throw new customError("All field are required!", 400);
    }

    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (!isMatch) {
      throw new customError("password is not matched", 409);
    }

    const token = jwt.sign(
      {
        id: loginUser._id,
        role: loginUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    loginUser.password = undefined;

    return {
      token,
      user: loginUser,
    };
  }

  async getUser(userId) {
    if (!userId) {
      throw new customError("User ID is required", 400);
    }

    const getUser = await User.findById(userId).select("-password");

    if (!getUser) {
      throw new customError("User not exist", 409);
    }
    return getUser;
  }

  async getAllUsers() {
    try {
      const getAll = User.find().select("-password").sort({ createdAt: -1 });

      return getAll;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    if (!userId) {
      throw new customError("User ID is required", 400);
    }

    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      throw new customError("User not found", 404);
    }
    return { message: "User deleted successfully" };
  }

  async updateUser(userId, userdata) {
    if (!userId) {
      throw new customError("User not found", 404);
    }

    const updateUser = await User.findByIdAndUpdate(userId, userdata, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updateUser) {
      throw new customError("User not found", 404);
    }
    return updateUser;
  }
}

export default new userService();
